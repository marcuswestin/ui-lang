# Interoperability with platform-specific APIs

There are lots of platform-specific APIs. Some are on one platform only, some are platform-specific. Some you'd want to address generically, some specifically.

## Thoughts

What would it look like to be really good at dropping down into the underlying language? This could allow for implementing one platform at a time in terms of backing code, while still having a shared overlying API

## Platform-specific APIs

### App Store - Subscriptions & Purchases

  - Detect if subscribed
  - Prompt & handle/ensure subscription
