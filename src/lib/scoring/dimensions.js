/**
 * The 5 dimensions of the Chess-Poker classification framework.
 *
 * Each dimension is scored 1-3:
 *   1 = Chess-like (high information, deterministic)
 *   2 = Hybrid
 *   3 = Poker-like (low information, uncertain)
 *
 * Total score range: 5-15
 *   5-7:  Chess  — execute with velocity
 *   8-10: Hybrid — decompose and sequence
 *   11-15: Poker — time and relationship
 */

export const DIMENSIONS = [
  {
    id: 'IC',
    label: 'Information Completeness',
    shortLabel: 'Info',
    description:
      'How complete is the information needed to execute this task? ' +
      '1 = all info available, 3 = significant unknowns',
    levels: [
      { value: 1, label: 'Complete', description: 'All information needed is available and clear' },
      { value: 2, label: 'Partial', description: 'Core info available but some gaps exist' },
      { value: 3, label: 'Incomplete', description: 'Significant unknowns or information must be gathered' },
    ],
  },
  {
    id: 'AA',
    label: 'Agent Adaptivity',
    shortLabel: 'Adapt',
    description:
      'How much does execution require adapting to other agents (people, systems)? ' +
      '1 = solo deterministic, 3 = highly dependent on others',
    levels: [
      { value: 1, label: 'Autonomous', description: 'Execution is fully within your control' },
      { value: 2, label: 'Collaborative', description: 'Requires coordination with others' },
      { value: 3, label: 'Dependent', description: 'Success heavily depends on others\' responses and actions' },
    ],
  },
  {
    id: 'OV',
    label: 'Outcome Verifiability',
    shortLabel: 'Verify',
    description:
      'How clearly can you verify success when the task is done? ' +
      '1 = binary pass/fail, 3 = subjective or ambiguous',
    levels: [
      { value: 1, label: 'Binary', description: 'Clear pass/fail criteria — objectively verifiable' },
      { value: 2, label: 'Measurable', description: 'Measurable outcome with some interpretation' },
      { value: 3, label: 'Subjective', description: 'Success is ambiguous or requires stakeholder buy-in' },
    ],
  },
  {
    id: 'RS',
    label: 'Rule Stability',
    shortLabel: 'Rules',
    description:
      'How stable are the rules and constraints governing this task? ' +
      '1 = fixed rules, 3 = rules shift during execution',
    levels: [
      { value: 1, label: 'Fixed', description: 'Rules are well-defined and won\'t change' },
      { value: 2, label: 'Evolving', description: 'Rules are mostly stable but may shift' },
      { value: 3, label: 'Fluid', description: 'Rules are unclear, contested, or change during execution' },
    ],
  },
  {
    id: 'RV',
    label: 'Reversibility',
    shortLabel: 'Revert',
    description:
      'How easy is it to reverse or undo this task\'s effects if needed? ' +
      '1 = fully reversible, 3 = irreversible or high-cost to undo',
    levels: [
      { value: 1, label: 'Reversible', description: 'Easily undone — low risk to proceed' },
      { value: 2, label: 'Partial', description: 'Some effects are reversible, others are not' },
      { value: 3, label: 'Irreversible', description: 'Hard or impossible to undo — proceed carefully' },
    ],
  },
]
