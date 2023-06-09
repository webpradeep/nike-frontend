import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import HeroBanner from '@/components/HeroBanner'
import Wrapper from '@/components/Wrapper'
import ProductCard from '@/components/ProductCard'
import { useEffect, useState } from 'react'
import { FetchDataFromApi } from '@/utils/api'
// import store from '@/store/store'
// import { Provider } from 'react-redux'


export default function Home({ products }) {
  // const [data, setData] = useState(null)
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await FetchDataFromApi('/api/products');
  //     setData(data)
  //     console.log(data)
  //   }
  //   fetchProducts()
  // }, [])
  return (
    <>
      <Head>
        <title>Nike Clone </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HeroBanner />
        <Wrapper>
          <div className='text-center max-w-[800] mx-auto my-[50px] md:my-[80px]'>
            <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
              Cushioning for Your Miles
            </div>
            <div className="text-md md:text-xl">
              A lightweight Nike ZoomX midsole is combined with
              increased stack heights to help provide cushioning
              during extended stretches of running.
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0'>
            {
              products?.data?.map((product) => (
                <ProductCard key={product?.id} data={product} />
              ))
            }
            {/* <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard /> */}
          </div>

        </Wrapper>
      </main>
    </>
  )
}



// SSG 

export async function getStaticProps() {
  const products = await FetchDataFromApi('/api/products?populate=*');
  return {
    props: {
      products
    }
  }
}
