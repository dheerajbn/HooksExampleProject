import React, { useCallback, useReducer, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import LoadingSpinner from '../UI/LoadingIndicator';
import useHttp from '../../hooks/http';

const ingredientsReducer = (state, action) => {
	switch (action.type) {
		case "SET":
			return action.payload.ingredients;
		case "ADD":
			return [...state, action.payload.ingredient];
		case 'DELETE':
			return state.filter(item => item.id !== action.payload.id);
		default:
			throw new Error('Should not be reacged');
	}
}

// const httpReducer = (state, action) => {
// 	switch (action.type) {
// 		case "SEND":
// 			return { loading: true, error: null };
// 		case "SUCCESS":
// 			return { loading: false, error: null };
// 		case 'FAILED':
// 			return { loading: false, error: action.payload.errorMsg };
// 		case 'CLEAR':
// 			return { ...state, error: null };
// 		default:
// 			throw new Error('Should not be reacged');
// 	}
// }

const Ingredients = () => {

	// const [ingredients, setIngredients] = useState([]);
	const [ingredients, dispatchIngredients] = useReducer(ingredientsReducer, []);
	// const [error, setError] = useState();
	// const [http, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

	const { isLoading, error, data, sendRequest, clearHttpError, extras } = useHttp();

	useEffect(() => {
		if (extras) {
			switch (extras.type) {
				case 'ADD':
					dispatchIngredients({ type: 'ADD', payload: { ingredient: { id: data.name, ...extras.data } } });
					break;
				case 'DELETE':
					dispatchIngredients({ type: 'DELETE', payload: { id: extras.data } });
					break;
				default:
					return;
			}
		}
	}, [data, extras]);

	// Will be loaded in search component 
	// useEffect(() => {
	//   axios.get('/ingredients.json').then(res => {
	//     let ingredients = [];
	//     for (const key in res.data) {
	//       ingredients.push({
	//         id: key,
	//         ...res.data[key],
	//       })
	//     }
	//     setIngredients(ingredients);
	//   }).catch(err => console.log(err));
	// }, []);

	const onAddIngredient = useCallback(ingredient => {
		// dispatchHttp({ type: 'SEND' });
		// axios.post('/ingredients.json', { ...ingredient }).then(res => {
		// 	// setIngredients(prevState => (
		// 	//   prevState.concat({ id: res.data.name, ...ingredient })
		// 	// ))
		// 	dispatchHttp({ type: "SUCCESS" });
		// 	dispatchIngredients({ type: 'ADD', payload: { ingredient: { id: res.data.name, ...ingredient } } });
		// }).catch(err => console.log(err));

		sendRequest('/ingredients.json', 'POST', JSON.stringify(ingredient), { type: 'ADD', data: ingredient });
	}, [sendRequest]);

	const onRemoveIngredient = useCallback(id => {
		// dispatchHttp({ type: "SEND" });
		// axios.delete(`/ingredients/${id}.json`).then(res => {
		// 	// setIngredients(prevState => prevState.filter(item => item.id !== id))
		// 	dispatchHttp({ type: "SUCCESS" });
		// 	dispatchIngredients({ type: 'DELETE', payload: { id: id } });
		// }).catch(err => dispatchHttp({ type: 'FAILED', payload: { errorMsg: err.message } }));

		sendRequest(`/ingredients/${id}.json`, 'DELETE', null, { type: 'DELETE', data: id });
	}, [sendRequest]);

	const onFilterIngredients = useCallback(ingredients => {
		// setIngredients(ingredients);
		dispatchIngredients({ type: 'SET', payload: { ingredients: ingredients } });
	}, []);

	// const clearError = useCallback(() => {
	// 	// dispatchHttp({ type: 'CLEAR' });
	// 	clearHttpError();
	// }, [clearHttpError]);

	const ingredientList = useMemo(() => {
		return <IngredientList ingredients={ingredients} onRemoveItem={onRemoveIngredient} />
	}, [ingredients, onRemoveIngredient]);

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearHttpError} >{error}</ErrorModal>}
			{isLoading && <LoadingSpinner />}
			<IngredientForm onAddIngredient={onAddIngredient} />

			<section>
				<Search onFilterIngredients={onFilterIngredients} />
				{ingredientList}
			</section>
		</div>
	);
}

export default Ingredients;
