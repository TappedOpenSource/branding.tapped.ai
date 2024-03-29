'use client';

import type { NextPage } from 'next';
import ProductCard from '@/components/ProductCard';
// import withAuth from '@/domain/auth/withAuth';
import { getProductAndPriceData } from '@/domain/usecases/payments';
import { useEffect, useState } from 'react';
import auth from '@/data/auth';
import { redirect, usePathname, useRouter } from 'next/navigation';

const subscriptionPlansIds = [
  'prod_PDFgqCLcjDQpP9', // premium
];

const Pricing: NextPage = () => {
  const pathname = usePathname();
  const [billingPortal, setBillingPortal] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProductAndPriceData();
      console.log({ products });
      setProducts(products);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    auth.getCustomClaims().then((claims) => {
      console.log({ claims });

      if (claims === undefined || claims === null) {
        redirect(`/login?returnUrl=${pathname}`);
        return;
      }

      const claim = claims['stripeRole'] as string | null;
      console.log({ claim });
      // if (claim !== undefined && claim !== null) {
      //   api.createPortalLink({ returnUrl: `${window.location.origin}/pricing` }).then(({ url }) => {
      //     console.log({ url });
      //     setBillingPortal(url);
      //   });
      // }
    });
  }, [pathname]);

  if (billingPortal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <a
          href={billingPortal}
          className="px-5 py-2 text-white bg-[#42A5F5] rounded-md"
        >
        manage subscription
        </a>
      </div>
    );
  }

  return (
    <>
      <h1 className="px-5 pt-10 text-left text-5xl font-bold text-white">
        pricing plans
      </h1>
      <p className="px-5 pb-10 pt-6 text-left text-lg text-white text-center">
        choose how long you want to subscribe for
      </p>
      <div className="flex flex-col md:flex-row justify-center">
        {products.filter(({ product }) => {
          console.log(product.name);
          return subscriptionPlansIds.includes(product.id);
        }).map(({ product, prices }) => {
          return (
            <div className="px-5 py-2 flex flex-col md:flex-row gap-4" key={product.name}>
              {prices.map((price: any) => {
                return (
                  <ProductCard product={product} price={price} key={price.id} />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pricing;
