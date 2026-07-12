# Objective

Create or update the route-security matrix for i2p-connect.

# Instructions

1. Inspect all HTTP routes, WebSocket handlers, IPC handlers, local admin endpoints, and API registration code.
2. Create a complete route inventory.
3. For each route, document:
   - Method
   - Path
   - Purpose
   - Authentication policy
   - CSRF policy
   - Authorization scope
   - Input schema
   - Rate-limit policy
   - Audit-log policy
   - Existing tests
   - Missing tests
4. Do not assume a route is public just because no middleware exists.
5. Mark unresolved items as UNKNOWN rather than guessing.
6. Do not change implementation unless explicitly asked.

# Output format

Create a markdown table and then a prioritized remediation list.

# Stop condition

If the route registration mechanism is unclear, stop and explain what files must be inspected next.
