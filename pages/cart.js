import CartItem from '@/components/CartItem'
import Wrapper from '@/components/Wrapper'
import { makePaymentRequest } from '@/utils/api'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLICABLE_KEY)


const Cart = () => {
    const [loading, setLoading] = useState(false)
    const { cartItems } = useSelector((state) => state.cart);
    const total = useMemo(() => {
        return cartItems.reduce((total, val) => total + val.attributes.price, 0)
    }, [cartItems])

    const handlePayment = async () => {
        try {
            setLoading(true)
            const stripe = await stripePromise;
            const res = await makePaymentRequest("/api/orders", {
                products: cartItems
            })
            await stripe.redirectToCheckout({
                sessionId: res.stripeSession.id
            })
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    return (
        <div className='w-full md:py-20'>
            <Wrapper>
                {
                    cartItems.length > 0 && (
                        <>
                            <div className='text-center max-w-[800px] mx-auto mt-8 md:mt-0'>
                                <div className='text-[20px] md:text-[34px] mb-5 font-semibold leading-light'>
                                    Shopping Cart
                                </div>
                            </div>
                            <div className='flex flex-col lg:flex-row gap-12 py-10'>
                                <div className='flex-[2]'>
                                    <div className='text-lg font-bold'>Cart Items</div>
                                    {
                                        cartItems.map((item) => (
                                            <CartItem key={item.id} data={item} />
                                        ))
                                    }

                                </div>
                                <div className='flex-[1]'>
                                    <div className='text-lg font-bold'>Summary</div>
                                    <div className='p-5 m-5 bg-black/[0.05] rounded-xl'>
                                        <div className='flex justify-between'>
                                            <div className='uppercase text-md md:text-lg font-medium text-black'>Subtotal</div>
                                            <div className='text-md md:text-lg font-medium text-black'> &#8377; {total}</div>
                                        </div>
                                        <div className='text-sm md:text-md py-5 border-t mt-5'>
                                            All Taxes are included in this total price.
                                        </div>

                                    </div>
                                    <button className='w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex gap-2 items-center justify-center' onClick={handlePayment}>Checkout {loading && <img src="spinner.svg" />}</button>
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    cartItems.length < 1 && (

                        <div className='flex-[2] flex flex-col items-center pb-[50px] md:-mt-14'>
                            <Image src='/empty-cart.jpg' width={300} height={300} alt='cart blank' className="w-[300px] md:[400px]" />
                            <span className='text-xl font-bold'>Your Cart is Empty</span>
                        </div>
                    )
                }




            </Wrapper>
        </div>
    )
}

export default Cart