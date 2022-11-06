/**
 * This the file that I learned to reverse engineer 
 * I learned to code this file from the youtube video that explains the steps to build 
 * an app that integrates Alan AI in it 
 * https://www.youtube.com/watch?v=4xwruFAvEHA&list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK&index=26
 * the link to the github repository of this video is the following
 * https://github.com/WebDevSimplified/Alan-AI-Ecommerce/tree/starting-code
 */
import React, { useCallback, useState } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import storeItems from "../items.json"

const COMMANDS = {
    open : 'open cart',
    close : 'close cart',
    add : 'add',
    check : 'checkout',
    rm : 'rm'
}


export default function useAlan2() {
    const [alanInstance, setAlanInstance] = useState(null)
    
    const {
        isCartEmpty, setShowCartItems, addToCart, removeFromCart, cart, checkout
    } = useCart();
    
    const remove = useCallback(({detail : payload}) => {
        const it = cart.find(e => e.item.name.toLowerCase() === payload);
        if (it == undefined) 
            alanInstance.playText('no can do')
        else {
            alanInstance.playText('removing item')
            removeFromCart(it.itemId);
        }
    },[alanInstance, removeFromCart, cart])
    

    const openCart = useCallback(() => {
        if (isCartEmpty)
            alanInstance.playText('cart is empty')
        else {
            alanInstance.playText("opening cart");
            setShowCartItems(true);
        }
    },[alanInstance, isCartEmpty, setShowCartItems])
    

    const closeCart = useCallback(() => {
        if (isCartEmpty)
            alanInstance.playText('cart is empty')
        else {
            alanInstance.playText("closing cart");
            setShowCartItems(false);
        }
    },[alanInstance, isCartEmpty, setShowCartItems])

    const addIt = useCallback(({detail : {name, q}}) => {
        console.log(name);
        const item = storeItems.find(e => e.name.toLowerCase() === name);
        if (item == undefined) 
            alanInstance.playText('no can do')
        else {
            alanInstance.playText('adding item')
            addToCart(item.id, q);
        }
      },[alanInstance, addToCart])
    
    const checkoutFun = useCallback(()=>{
        checkout();
    }, [alanInstance, checkout])

    useEffect(() => {
      window.addEventListener(COMMANDS.open, openCart)
      window.addEventListener(COMMANDS.close, closeCart)
      window.addEventListener(COMMANDS.add, addIt)
      window.addEventListener(COMMANDS.rm, remove)
      window.addEventListener(COMMANDS.check, checkoutFun)
    
      return () => {
        window.removeEventListener(COMMANDS.open, openCart)
        window.removeEventListener(COMMANDS.close, closeCart)
        window.removeEventListener(COMMANDS.add, addIt)
        window.removeEventListener(COMMANDS.rm, remove)
        window.removeEventListener(COMMANDS.check, checkoutFun)

      }
    }, [openCart, closeCart, addIt, remove, checkoutFun])
    

    useEffect(() => {
        if (alanInstance) return

        setAlanInstance(
            
            alanBtn({
                top: "15px",
                left: "15px",
                key: process.env.REACT_APP_ALAN_KEY,
                onCommand: ({command, payload}) => {
                    window.dispatchEvent(new CustomEvent(command, {detail : payload}))
                }
            })

        )

    }, []);


  return (
    null
  )
}
