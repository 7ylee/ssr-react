import { COUNTER_INCREMENT, COUNTER_DECREMENT } from '../action/types';

export default function counter(state = 0, action = {}) {
    switch (action.type) {
        case COUNTER_INCREMENT:
            return state + 1;
        case COUNTER_DECREMENT:
            return state - 1;
        default:
            return state;
    }
}
