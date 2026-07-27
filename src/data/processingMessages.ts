export const processingMessagePools = [
  [
    "Preparing payment...",
    "Initializing payment request...",
    "Validating transaction details...",
    "Creating payment authorization request...",
    "Securing payment session...",
    "Confirming transaction amount...",
    "Packaging payment for review...",
    "Opening payment workflow...",
    "Registering transaction...",
    "Submitting payment for authorization...",
  ],
  [
    "Checking with Finance...",
    "Locating a valid cost center...",
    "Checking the discretionary budget...",
    "Searching for remaining fiscal-year funds...",
    "Confirming the budget owner...",
    "Verifying the approved spending limit...",
    "Checking the latest budget reforecast...",
    "Reconciling payment with the operating plan...",
    "Confirming the appropriate general ledger account...",
    "Routing the request through Accounts Payable...",
  ],
  [
    "Checking with Legal...",
    "Reviewing compensation policies...",
    "Determining whether this counts as compensation...",
    "Checking recipient eligibility...",
    "Screening for policy exceptions...",
    "Confirming the required documentation...",
    "Reviewing internal payment controls...",
    "Checking whether a purchase order is required...",
    "Verifying the transaction classification...",
    "Consulting the policy interpretation committee...",
  ],
  [
    "Escalating for approval...",
    "Checking delegation-of-authority limits...",
    "Verifying the approver's approval authority...",
    "Requesting secondary approval...",
    "Routing the request to executive review...",
    "Waiting for budget owner approval...",
    "Escalating beyond delegated authority...",
    "Requesting exception approval...",
    "Adding another required signatory...",
    "Searching for someone still authorized to approve this...",
  ],
  [
    "Waiting for the expense committee to achieve quorum...",
    "Requesting approval from someone authorized to approve approvers...",
    "Reviewing the review of the previous review...",
    "Confirming the approval was approved correctly...",
    "Checking whether Finance has changed its mind...",
    "Reopening the request for one final review...",
    "Sending the payment around for additional concurrence...",
    "Waiting for the final final approval...",
    "Verifying no new policy was issued in the last minute...",
    "Reviewing compensation policies one more time...",
  ],
] as const;

export function createProcessingSequence(
  random: () => number = Math.random,
): string[] {
  return processingMessagePools.map((pool) => {
    const index = Math.max(
      0,
      Math.min(pool.length - 1, Math.floor(random() * pool.length)),
    );
    return pool[index];
  });
}
