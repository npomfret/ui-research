# In-Browser App State Management for Auth, APIs, and Realtime

## Context

Modern browser apps usually mix five different state classes:

- auth/session state
- server state fetched over HTTP
- realtime deltas from WebSocket or SSE
- optimistic/pending mutation state
- purely local UI state

Most state-management problems come from collapsing all five into one global store.

Official data-layer docs now make the split explicit: server state is different from client state because it lives remotely, changes outside your control, and can become stale without any local action. Browser API docs add two practical constraints: Web Storage is synchronous, and the classic `WebSocket` API has no backpressure support. Security guidance adds the other major constraint: session identifiers should not live in `localStorage`.

## Principles

1. Separate server state from local UI state

Use a dedicated server-state cache for API data and keep your app store focused on local UI concerns such as filters, drawers, draft form state, and optimistic-operation metadata.

Practical result:

- server data lives in query/cache entries keyed by request shape
- local UI state lives in route state, component state, or a small client store
- auth/session status lives in its own narrow slice

2. Treat auth as a session capability, not a second user store

Your auth layer should answer:

- is the user authenticated?
- who is the current user?
- what capabilities or tenant context apply?

It should not become a dumping ground for profiles, settings, organizations, unread counts, and live collections. Those belong in normal data queries keyed and invalidated independently.

3. Bootstrap with HTTP, then stream deltas

Start from a normal API snapshot. After that, use WebSocket or SSE for incremental updates.

Inference from MDN and RTK Query guidance: this is the safest default because HTTP gives you a canonical snapshot, while realtime channels are better at delivering small deltas than reconstructing full page state from scratch.

4. Realtime transport updates caches; it does not become a second source of truth

Push events should either:

- invalidate affected queries so they refetch, or
- patch an existing cached query in place

Do not maintain one full copy of business data in your query cache and another full copy in a custom socket store.

5. Logout is a teardown workflow

Logout is not just "call `/logout` then redirect." It should terminate session authority, inflight network work, cached sensitive state, cross-tab state, and long-lived realtime connections.

6. Cross-tab behavior must be designed

If a user logs out, switches tenant, or their session expires in one tab, the others must converge quickly. The browser gives you `BroadcastChannel` for this. Use it deliberately.

## Recommended State Model

### Layer 1: Session state

Keep only the minimum durable auth/session information in memory:

- `sessionStatus`: `unknown | anonymous | authenticating | authenticated | expired`
- `userId`
- `tenantId` or account scope
- auth bootstrap timestamp

Prefer server-managed cookies for browser sessions:

- `HttpOnly`
- `Secure`
- `SameSite=Lax` or `Strict` unless cross-site usage is required
- `__Host-` or `__Host-Http-` prefixes when they fit your deployment model

Do not store session identifiers in `localStorage`.

### Layer 2: Server-state cache

Use a dedicated query/cache layer for HTTP-loaded data. The important behaviors are:

- request deduplication
- cache keys based on request identity
- invalidation after mutations
- background refetch on focus/reconnect where appropriate
- cancellation support

Good fits include TanStack Query or RTK Query. The key architectural point is not the brand; it is that API data should be handled as cacheable server state rather than copied into ad hoc reducers.

### Layer 3: Realtime connection state

Track transport state separately from business data:

- `socketStatus`: `disconnected | connecting | open | stale | closing`
- last connected time
- last event ID or version seen
- reconnect attempt count

This state is operational. It should not also hold the current list of messages, notifications, or entities if those already live in the cache layer.

### Layer 4: Optimistic and pending mutation state

Keep an explicit place for:

- pending mutations
- optimistic patches
- retry intent
- toast/error metadata

This lets you reconcile delayed API responses and websocket echoes without corrupting your canonical cache entries.

### Layer 5: Local UI state

Keep route-local and interaction-local state close to the UI:

- open dialogs
- active tab
- local form drafts
- sort order
- temporary selections

Avoid promoting this into a global store unless multiple distant surfaces truly need it.

## Lifecycle: Login to Logout

### Login

1. Submit credentials over HTTPS.
2. Let the server establish session authority, ideally via secure cookies.
3. Fetch a bootstrap query such as `/me`, `/session`, or equivalent.
4. Enable authenticated queries only after bootstrap succeeds.
5. Open websocket or SSE only after auth/bootstrap is confirmed.
6. Broadcast the new session state to sibling tabs if needed.

Useful trick:

- create one canonical bootstrap query like `['session']` or `['viewer']`
- gate other authenticated queries from that result

This avoids every feature inventing its own "am I logged in?" logic.

### App startup with an existing session

On refresh or new tab:

1. start in `unknown`
2. run the bootstrap session query
3. only render authenticated shells after it resolves
4. then hydrate page-specific queries
5. then attach realtime subscriptions

Avoid reading stale cached user data before the session check has run. That is how apps flash the previous user or previous tenant during account switching.

### Fetching data

Best practices:

- centralize fetch behavior in one client wrapper
- pass `AbortSignal` through every request path
- add explicit timeouts for critical requests
- make credentials behavior explicit, especially cross-origin
- normalize 401/403 handling in one place

If you use a query library, prefer declarative invalidation or tag-based refetching over hand-written "fetch again everywhere" logic.

### Mutations

Best practices:

- classify each mutation as `optimistic`, `pessimistic`, or `invalidate-only`
- cancel overlapping reads before optimistic writes when your cache tool supports it
- patch narrowly; invalidate broadly only when precise patching is not safe
- treat retries as business decisions, not a blanket default

Inference from cache-library guidance: optimistic updates are safest when you can identify the exact entity and rollback path. For broad list reordering or permission changes, invalidation is usually less fragile.

### Realtime sync

Default pattern:

1. fetch initial snapshot via HTTP
2. open websocket or SSE
3. apply small deltas to cache or invalidate affected queries
4. if you detect a gap, version mismatch, or reconnect after downtime, refetch the authoritative query

Prefer SSE when the server only needs to push to the client. Prefer WebSocket when the client also needs to send live commands or acknowledgements.

Inference: event payloads should usually contain:

- event type
- entity ID
- tenant/account scope
- monotonic version or event ID
- event timestamp

Without some kind of ordering/version marker, reconnect and duplicate-delivery handling becomes guesswork.

### Logout and session expiry

Order matters:

1. stop creating new authenticated work
2. abort inflight API requests
3. close websocket/SSE connections
4. tell the server to end the session
5. clear sensitive query caches and optimistic state
6. clear any user-scoped local state
7. broadcast logout/session-expired to other tabs
8. navigate to signed-out UI

If your backend supports it, add `Clear-Site-Data` on logout and use `Cache-Control: no-store` on responses that contain session identifiers or sensitive data.

## Patterns That Hold Up Well

### Pattern: Query cache for API data, small store for UI

This is the default recommendation for most browser apps.

Use it when:

- most business data comes from HTTP APIs
- many screens reuse the same entities
- you need refetching, invalidation, retries, and deduping

Avoid replacing it with one giant reducer tree full of `isLoading` booleans.

### Pattern: Snapshot + stream

Fetch the full object once, then patch it with realtime updates.

This works especially well for:

- chats
- notifications
- dashboards with external updates
- collaborative views
- large objects with small frequent field changes

RTK Query’s streaming guidance is effectively this pattern in library form.

### Pattern: Invalidate on broad events, patch on precise events

Examples:

- `invoice.updated` with full invoice payload: patch cache directly
- `permissions.changed` or `membership.changed`: invalidate all affected queries
- `tenant.switched`: clear tenant-scoped caches and refetch

This balance is usually more robust than forcing every socket message through custom reducers.

### Pattern: Cross-tab auth bus

Use `BroadcastChannel` for auth lifecycle messages such as:

- `login`
- `logout`
- `session-expired`
- `tenant-switched`

Keep the payloads small and semantic. Do not try to mirror your full query cache across tabs unless you have a strong reason.

### Pattern: Auth-gated queries, not permanently disabled queries

Gate authenticated queries on a real session condition. Do not leave them permanently disabled and trigger them manually forever.

Reason: some cache libraries explicitly document that disabled queries ignore normal invalidation/refetch behavior. That becomes a maintenance trap.

### Pattern: Explicit connection cleanup

Close sockets:

- on logout
- on session expiry
- on page teardown where appropriate
- when the cache subscription that required them is removed

MDN specifically notes that open WebSocket connections can keep pages out of the back/forward cache, so page lifecycle cleanup has performance impact too.

## Tricks

### Trick: Combine cancellation and timeout

Use `AbortController` plus `AbortSignal.timeout()` and `AbortSignal.any()` so a request can be cancelled either by app lifecycle or by timeout.

This is especially useful during route transitions, logout, and tab close.

### Trick: Namespace persisted non-sensitive state by user

If you persist drafts, dismissed banners, or view preferences, key them by user ID and tenant ID. Otherwise account switching will leak old UI state into the next session.

### Trick: Keep websocket payloads tiny

Send event metadata and changed fields, not full page models, unless the domain really demands it.

Reason:

- lower bandwidth
- lower parse cost
- lower chance of clobbering fresher local state

### Trick: Reconcile socket events through the cache layer

If a realtime event affects `['projects', projectId]`, update or invalidate that query directly. That keeps all subscribed components converging through one path.

### Trick: Prefer SSE for one-way feeds

If the client never needs to send live messages, SSE can be simpler operationally than WebSocket. It is explicitly unidirectional and stays within normal HTTP semantics.

### Trick: Use one reconnect policy, not ad hoc retries everywhere

Put reconnect/backoff logic in one transport module. UI code should observe connection state, not implement it.

Inference: use jittered exponential backoff and force a fresh snapshot after reconnect if you may have missed events.

## Anti-Patterns

### 1. Storing tokens or session IDs in `localStorage`

This is both a security smell and often an architectural smell. OWASP explicitly advises against storing session identifiers there, and Web Storage is synchronous on top of that.

### 2. One global store containing auth, API entities, websocket payloads, and UI flags

This creates duplication, stale reads, and impossible invalidation logic.

### 3. Fetching directly inside random components with custom `isLoading` and `error` flags everywhere

You lose dedupe, cancellation discipline, refetch policy, and cache coherence.

### 4. Using websocket as the only source of truth

If the page cannot recover from missed events by refetching a canonical HTTP snapshot, it will eventually drift.

### 5. Opening realtime connections before auth/bootstrap is stable

This creates race conditions around session refresh, tenant scope, and unauthorized subscriptions.

### 6. Not clearing client state on logout

Typical failure modes:

- previous user flashes after logout/login
- tenant switch shows stale data
- old optimistic writes finish into the wrong session

### 7. Leaving queries permanently disabled

This often looks neat initially, but some query libraries document that disabled queries ignore normal invalidation and background refetch. You end up rebuilding the library manually.

### 8. Persisting full API caches in the browser by default

Official RTK Query guidance explicitly warns that persisting API slices in browsers can leave users with very stale data. Persist only when you have a clear offline requirement and a clear invalidation strategy.

### 9. Mirroring the same entity collection in both cache and socket reducers

Two stores means two merge policies, two invalidation paths, and hidden divergence.

### 10. Replacing large lists on every websocket event

That wastes bandwidth and causes avoidable render churn. Patch one entity or invalidate one query instead.

### 11. Sending bearer tokens in websocket URLs without understanding the logging risk

OWASP notes that query-string tokens will appear in access logs. If you use them, treat log redaction as mandatory. In many cases, cookie-backed auth or post-connect auth messages are safer.

### 12. Forgetting cross-tab convergence

Without a cross-tab signal, one tab logs out while another happily keeps rendering privileged state until its next failing request.

### 13. Ignoring websocket backpressure and lifecycle

MDN is explicit that classic `WebSocket` has no backpressure. If the server can outpace the client, you need rate control, coalescing, or a different transport strategy.

### 14. Treating `Path` on cookies as a security boundary

MDN explicitly notes that cookie `Path` controls sending behavior, not read protection. Do not use it as a substitute for proper cookie scoping and `HttpOnly`.

## Practical Decision Rules

- If data is fetched from an API and can be refetched, put it in a server-state cache.
- If the value only matters to one screen interaction, keep it local.
- If the server pushes read-only updates, consider SSE before WebSocket.
- If a realtime event is precise, patch cache. If it is broad or risky, invalidate and refetch.
- If data is sensitive, prefer secure cookies and in-memory state over browser storage.
- If logout happens, think teardown first and navigation second.

## References

- MDN: Using the Fetch API  
  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- MDN: Request.credentials  
  https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
- MDN: AbortController  
  https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- MDN: AbortSignal.timeout()  
  https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
- MDN: WebSocket  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- MDN: The WebSocket API  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- MDN: Writing WebSocket client applications  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
- MDN: EventSource  
  https://developer.mozilla.org/en-US/docs/Web/API/EventSource
- MDN: Broadcast Channel API  
  https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
- MDN: Web Storage API  
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN: Set-Cookie  
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
- MDN: Clear-Site-Data  
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data
- TanStack Query: Overview  
  https://tanstack.com/query/latest/docs/framework/react/overview
- TanStack Query: Query Cancellation  
  https://tanstack.com/query/v5/docs/framework/react/guides/query-cancellation
- TanStack Query: Disabling/Pausing Queries  
  https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries
- TanStack Query: broadcastQueryClient (experimental)  
  https://tanstack.com/query/latest/docs/framework/react/plugins/broadcastQueryClient
- Redux Toolkit: RTK Query Overview  
  https://redux-toolkit.js.org/rtk-query/overview
- Redux Toolkit: Cache Behavior  
  https://redux-toolkit.js.org/rtk-query/usage/cache-behavior
- Redux Toolkit: Automated Re-fetching  
  https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
- Redux Toolkit: Streaming Updates  
  https://redux-toolkit.js.org/rtk-query/usage/streaming-updates
- Redux Toolkit: Persistence and Rehydration  
  https://redux-toolkit.js.org/rtk-query/usage/persistence-and-rehydration
- OWASP: HTML5 Security Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- OWASP: Session Management Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP: WebSocket Security Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
