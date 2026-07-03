# Prompt 02: Identity Model

Design a local identity model for I2P Connect.

Requirements:

- keep identity material local by default
- never store private keys or private destinations in cloud services
- document backup and loss risks
- add migration and persistence tests when runtime storage exists
- sanitize logs

Full E2EE is not promised until implementation and tests support that claim.
