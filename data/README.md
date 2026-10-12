# Demo data

Everything here is **fictional**: customers, cards, transactions, merchants and policies are synthetic and exist only for the demo.

- `seed/`: customers, cards, transactions and existing cases. Transaction dates are stored as `daysAgo` and turned into real dates when the app starts, so the 60-day dispute window always works.
- `policies/`: the fictional demo dispute policy. Clause IDs (e.g. `DSP-1.2`) are what evidence references point to.
- `calls/`: scripted calls played by the call simulator.
