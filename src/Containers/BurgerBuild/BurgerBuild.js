import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../Components/Burger/Burger';
import Modal from '../../Components/UI/Modal/Modal';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuild extends Component  {
        
    state = {
        ingredients:null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://react-burger-builder-f7dd6.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch (error => {
                this.setState({error: true})
            });
    }

    updatePurchaseState (ingredients) {
        
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);

    }

    purchaseHandler =  () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler =  () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('You Continue!');
        this.setState( {loading: true });
        const order = {
            ingredient: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'R SM',
                address: {
                    street: '1 Main street',
                    zipCode: '12345'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order) //to my firebase database, it differs per project depending on your back end
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false});
            } );
    }

render() {
    const disabledInfo = {
        ...this.state.ingredients
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = this.state.error ? <p> Ingredients can not be loaded! </p> : <Spinner />

    if (this.state.ingredients){

        burger = (
            <Auxiliary>
                <Burger  ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.totalPrice}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
            </Auxiliary>
        );
        orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}/>;
    
    }

    if(this.state.loading) {
        orderSummary = <Spinner />;
    }
        
    
      
    return (
        <Auxiliary>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
               {orderSummary} 
            </Modal>
            {burger}
            
        </Auxiliary>
    );
}
}

export default withErrorHandler(BurgerBuild, axios);