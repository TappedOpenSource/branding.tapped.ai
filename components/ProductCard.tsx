
import Image from 'next/image';

const ProductCard = ({ product }: { product: any }) => {
  /*
    // set product data
    container.querySelector('h2').innerText = product.name.toUpperCase();
    container.querySelector('.description').innerText =
    product.description?.toUpperCase() || '';

    // Prices dropdown
    prices.forEach((doc) => {
      const priceId = doc.id;
      const priceData = doc.data();
      prices[priceId] = priceData;
      const content = document.createTextNode(
        `${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: priceData.currency,
        }).format((priceData.unit_amount / 100).toFixed(2))} per ${
          priceData.interval ?? 'once'
        }`
      );
      const option = document.createElement('option');
      option.value = priceId;
      option.appendChild(content);
      container.querySelector('#price').appendChild(option);
    });

    if (product.images.length) {
      const img = container.querySelector('img');
      img.src = product.images[0];
      img.alt = product.name;
    }

    const form = container.querySelector('form');
    form.addEventListener('submit', subscribe);

    products.appendChild(container);
  });
*/

  console.log(JSON.stringify(product));
  return (
    <>
      <p className="text-white">
        {product?.name ?? 'UNKNOWN'}
      </p>
      <p className="text-white">
        {product?.role ?? 'UNKNOWN'}
      </p>
      <Image src={product?.images[0]} alt={product?.name} width={200} height={200} />
    </>
  );
};

export default ProductCard;
