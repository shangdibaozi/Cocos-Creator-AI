cc.Class({

	ctor(onwer) {
		// a pointer to the agent that owns this instance
		this.m_pOwner = onwer;
		this.m_pCurrentState = null;
		// a recode of the last state the agent was in
		this.m_pPreviousState = null;
		// this is called every time the FSM is updated
		this.m_pGlobalState = null;
	},

	SetCurrentState(s) {
		this.m_pCurrentState = s;
	},

	SetGlobalState(s) {
		this.m_pGlobalState = s;
	},

	SetPreviousState(s) {
		this.m_pPreviousState = s;
	},

	Update() {
		// if a global state exists, call its execute method, elese do nothing
		if(this.m_pGlobalState) {
			this.m_pGlobalState.Execute(this.m_pOwner);
		}
		// same for the current state
		if(this.m_pCurrentState) {
			this.m_pCurrentState.Execute(this.m_pOwner);
		}
	},

	// change to a new state
	ChangeState(pNewState) {
		cc.assert(pNewState, '<StateMachine::ChangeState>: trying to change to NULL state');

		// keep a record of the previous state
		this.m_pPreviousState = this.m_pCurrentState;

		// call the exit method of the existing state
		this.m_pCurrentState.Exit(this.m_pOwner);

		// change state to the new state
		this.m_pCurrentState = pNewState; 

		// call the entry method of the new state
		this.m_pCurrentState.Enter(this.m_pOwner);
	},

	// change state back to the previous state
	RevertToPreviousState() {
		this.ChangeState(this.m_pPreviousState);
	},

	// returns true if the current state's type is equal to the type of the class pased as a parameter.
	isInState(st) {
		return typeof this.m_pCurrentState == typeof st;
	},

	CurrentState() {
		return this.m_pCurrentState;
	},

	GlobalState() {
		return this.m_pGlobalState;
	},

	PreviousState() {
		return this.m_pPreviousState;
	}
});