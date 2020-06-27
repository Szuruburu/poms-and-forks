import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';

import { Topbar, Content } from './components'; 
import { hideNavigation } from 'data/actions/app.actions';

function ShoppinglistPage({ 
	prevIngredientsShoppingList,
	hideNavigation
 }){

	const [ingredientsArrForShoppingList, setIngredientsArrForShoppingList] = useState();
	const [newReduceIngredientsArr, setNewReduceIngredientsArr] = useState();

	useEffect(() => {
		hideNavigation();
		setIngredientsArrForShoppingList(prevIngredientsShoppingList);
	}, [hideNavigation, prevIngredientsShoppingList])
	
	const sumIngredients = useMemo(
		() => {
		if(ingredientsArrForShoppingList){
			// Stwórz nową tablicę na której będziesz pracował kopia prevIngredientsShoppingList
			const newArr = [...ingredientsArrForShoppingList];
			// Przychodzi tablica obiektów  {name, amount, value}. Pogrupuj składniki jeśli występują z taką samą nazwą.
			const groupedNewArr = newArr.reduce(function (r, a) {
				r[a.name] = r[a.name] || [];
				r[a.name].push(a);
				return r;
			}, Object.create(null));
			// Sprawdź czy jednostka jest równa jednostce GLOBALNEJ (np. gram dla cukru, dla ml dla mleka itp.) i jeśli jest to dodaj do siebie wartości klucza value,
			// jeśli nie jest to wykorzystaj instrukcję warunkową if else i wykorzystaj współczynnik który ujednorodni jednostki z GLOBALNĄ jednostką. Następnie dodaj do siebie nowe wartości.
			const newIngredients = Object.entries(groupedNewArr).map(element => {
				const currentShoppingIngredientArr = [...element[1]];
				if(currentShoppingIngredientArr.length > 1){
					const amount = currentShoppingIngredientArr.reduce((r, a) => {
						return r + parseFloat(a['amount']);
					}, 0);

					return ({
						name: currentShoppingIngredientArr[0].name,
						amount: amount,
						unit: currentShoppingIngredientArr[0].unit,
						id: currentShoppingIngredientArr[0].id,
					});
				}
				return currentShoppingIngredientArr[0];
			})
			// Stwórz nową tablicę z przetworzonych / sprawdzonych produktów.
			return newIngredients
		}
		return [];
	},[ingredientsArrForShoppingList]);

	return(
		<React.Fragment>
			<Topbar ingredientsArrForShoppingList={ingredientsArrForShoppingList}/>
			<Content sumIngredientsArr={sumIngredients} prevIngredientsShoppingList={prevIngredientsShoppingList} setIngredientsArrForShoppingList={setIngredientsArrForShoppingList}/>			
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	prevIngredientsShoppingList: state.applicationRecuder.shoppinglistIngredients,
  });

const mapDispatchToProps = dispatch => ({
	hideNavigation: () => dispatch(hideNavigation()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppinglistPage);