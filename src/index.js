/**
 * Rules for state machine executor fn
 * 
 * The event is checked against the current state’s transitions.
 * If a transition matches the event, that transition “happens”.
 * By virtue of a transition “happening”, states are exited, and entered and the relevant actions are performed
 * The machine immediately is in the new state, ready to process the next event.
*/

/**
 * InitialState
 * on occurence of a valid event/transition call the transition actions for the old state
 * call exit event for the old state
 * migrate to new state - base on data from the old event's obj
 * call enter event for the new state
 * assign new state as the current value of the state machine
 * return
 */
const createMachine = (stateDefinition) => {
    const machine = {
        value: stateDefinition.initialState,
        transition(currentState, event) {
            const currentStateDef = stateDefinition[currentState]
            const destinationTransition = currentStateDef.transitions[event] // ON
            if (!destinationTransition) return

            const newState = stateDefinition[destinationTransition.target]

            // transition action
            destinationTransition.action()
            // Exit old state
            currentStateDef.actions.onExit()
            // Enter new state
            newState.actions.onEnter()
            // assign new state to obj variable
            machine.value = destinationTransition.target

            return machine.value
        }
    }

    return machine
}


/**
 * Rules for a finite state machine definition
 * 
 * One state is defined as the initial state. When a machine starts to execute, it automatically enters this state.
 * Each state can define actions that occur when a machine enters or exits that state. Actions will typically have side effects.
 * Each state can define events that trigger a transition.
 * A transition defines how a machine would react to the event, by exiting one state and entering another state.
 * A transition can define actions that occur when the transition happens. Actions will typically have side effects.
 */
const machine = createMachine({
    initialState: 'off',
    off: {
        actions: {
            onEnter() {
                console.log('Inside off: onEnter')
            },
            onExit() {
                console.log('Inside off: onExit')
            }
        },
        transitions: {
            switch: {
                target: 'on',
                action() {
                    console.log('transition action for switch in OFF state')
                }
            }
        }
    },
    on: {
        actions: {
            onEnter() {
                console.log('Inside on: onEnter')
            },
            onExit() {
                console.log('Inside on: onExit')
            }
        },
        transitions: {
            switch: {
                target: 'off',
                action() {
                    console.log('transition action for switch in ON state')
                }
            }
        }
    }
})


// Actions
let state = machine.value
console.log(`current state: ${state}`) // off state
state = machine.transition(state, 'switch')
console.log(`current state: ${state}`) // on state
state = machine.transition(state, 'switch')
console.log(`current state: ${state}`) // off state
