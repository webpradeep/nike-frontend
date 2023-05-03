import ProductDetailsCarousel from '@/components/ProductDetailsCarousel'
import RelativeProducts from '@/components/RelativeProducts'
import Wrapper from '@/components/Wrapper'
import { addToCart, cartSlice } from '@/store/cartSlice'
import { FetchDataFromApi } from '@/utils/api'
import { getDiscountPrice } from '@/utils/helper'
import React, { useState } from 'react'
import { IoMdHeartEmpty } from 'react-icons/io'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = ({ product, products }) => {
    const [selectedSize, setSelectedSize] = useState()
    const [showError, setShowError] = useState(false)
    const p = product?.data?.[0]?.attributes;
    const dispatch = useDispatch()

    const notify = () => {
        toast('🦄 Success, check your cart', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    return (
        <div className='w-full md:py-20'>
            <ToastContainer />
            <Wrapper>
                <div className='flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]'>
                    <div className='w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0'>
                        <ProductDetailsCarousel images={p.image.data} />
                    </div>
                    <div className='flex-1 py-3'>
                        <div className='text-[34px] font-semibold mb-2 leading-tight'> {p.name}</div>
                        <div className='text-lg font-semibold mb-5'>{p.subtitle}</div>
                        <div className='flex items-center gap-2'>
                            <div className='text-lg font-semibold'>MRP: &#8377; {p.price}</div>
                            {
                                p.original_price && (
                                    <>
                                        <p className='text-base font-medium line-through'>
                                            &#8377; {p.original_price}
                                        </p>
                                        <p className='ml-auto text-base font-medium text-green-500'>
                                            {getDiscountPrice(p.original_price, p.price)} % off
                                        </p>
                                    </>

                                )
                            }

                        </div>
                        <div className='text-md font-medium text-black/[0.5]'>incl. of taxes</div>
                        {/* product size */}
                        <div className='mb-10'>
                            <div className='flex justify-between mb-2 mt-9'>
                                <div className='text-md font-semibold'>Select size</div>
                                <div className='text-md font-medium text-black/[0.5] cursor-pointer'>Select guide</div>
                            </div>
                        </div>
                        {/* size selection  */}
                        <div className='grid grid-cols-3 gap-2' id="checkSize">
                            {
                                p?.size?.data?.map((item, i) => (
                                    <div key={i} className={`border rounded-md text-center 
                                    py-3 font-medium ${item.enabled ? "hover:border-black cursor-pointer" : "cursor-not-allowed bg-black/[0.05] opacity-50"} ${selectedSize === item.size ? "border-black" : ""}`}
                                        onClick={() => {
                                            setSelectedSize(item.size)
                                            setShowError(false)
                                        }}
                                    > {item.size}</div>
                                ))
                            }


                        </div>
                        {
                            showError && <div className='text-red-600 mt-1 mb-5'>Size selection is required</div>
                        }

                        {/* add to cart button  */}
                        <button className='w-full mt-4 py-4 rounded-full bg-black text-white text-lg font-med
                        transition-transform active:scale-95 mb-3 hover:opacity-75' onClick={() => {
                                if (!selectedSize) {
                                    setShowError(true)
                                    document.getElementById("checkSize").scrollIntoView({
                                        block: "center",
                                        behavior: "smooth"
                                    })
                                } else {
                                    dispatch(addToCart({ ...product?.data?.[0], selectedSize, oneQuantityPrice: p.price }))
                                    notify()
                                }
                            }}>Add to Cart</button>
                        {/* whishlist button  */}
                        <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">Whishlist <IoMdHeartEmpty size={20} /></button>
                        {/* product description  */}
                        <div>
                            <div className='text-lg font-bold mb-5'>Product Detail</div>
                            <div className='text-md mb-5'>
                                <ReactMarkdown>
                                    {p.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <RelativeProducts products={products} />
                </div>
            </Wrapper>
        </div>
    )
}

export default ProductDetails


export async function getStaticPaths() {
    const products = await FetchDataFromApi("/api/products?populate=*");
    const paths = products?.data?.map((p) => ({
        params: {
            slug: p.attributes.slug,
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params: { slug } }) {
    const product = await FetchDataFromApi(`/api/products?populate=*&filters[slug][$eq]=${slug}`);
    const products = await FetchDataFromApi(
        `/api/products?populate=*&[filters][slug][$ne]=${slug}`
    );

    return {
        props: {
            product,
            products,
            slug,
        },
    };
}