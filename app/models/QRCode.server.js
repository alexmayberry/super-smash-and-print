import qrcode from "qrcode";
import invariant from "tiny-invariant";
import db from "../db.server";

export async function getQRCode(id, graphql) {

  // Getting qrCode from db
  const qrCode = await db.qRCode.findFirst({ where: { id } });

  if (!qrCode) {
    return null;
  }

  return supplementQRCode(qrCode, graphql);
}

export async function getQRCodes(shop, graphql) {
  const qrCodes = await db.qRCode.findMany({
    where: { shop },
    orderBy: { id: "desc" },
  });

  if (qrCodes.length === 0) return [];

  return Promise.all(
    qrCodes.map((qrCode) => supplementQRCode(qrCode, graphql))
  );
}

export function createQRCodeImage(id) {
  const url = new URL(`/qrcodes/${id}/scan`, process.env.SHOPIFY_APP_URL);
  return qrcode.toDataURL(url.href);
}

export async function createBarcodeImage(productBarcode) {
  // const url = `https://barcodeapi.org/api/code128/${productBarcode}`
  // console.log(url);

  // const response = await fetch(url);

  // console.log(response);

  // try {
  //   const response = fetch(url);

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }

  //   const data = await response.json();
  //   console.log(data);

  // } catch (error) {
  //   console.error('Error:', error.message);
  // }

  // return data;
}

export function getDestinationUrl(qrCode) {
  if (qrCode.destination === "product") {
    return `https://${qrCode.shop}/products/${qrCode.productHandle}`;
  }

  const match = /gid:\/\/shopify\/ProductVariant\/([0-9]+)/.exec(qrCode.productVariantId);
  invariant(match, "Unrecognized product variant ID");

  return `https://${qrCode.shop}/cart/${match[1]}:1`;
}

// send qrCode image and product data to browser to render popuated form
async function supplementQRCode(qrCode, graphql) {

  console.log("da qrCode: ", qrCode)
  
  const qrCodeImagePromise = createQRCodeImage(qrCode.id);
  const barcdeImagePromise = createBarcodeImage(qrCode.productVariantBarcode);

  const response = await graphql(
    `
      query supplementQRCode($id: ID!) {
        product(id: $id) {
          title
          images(first: 1) {
            nodes {
              altText
              url
            }
          }
        }
      }
    `,
    {
      variables: {
        id: qrCode.productId,
      },
    }
  );

  const {
    data: { product },
  } = await response.json();

  return {
    ...qrCode,
    productDeleted: !product?.title,
    productTitle: product?.title,
    productImage: product?.images?.nodes[0]?.url,
    productAlt: product?.images?.nodes[0]?.altText,
    destinationUrl: getDestinationUrl(qrCode),
    image: await qrCodeImagePromise,
    barcode: await barcdeImagePromise
  };
}

export function validateQRCode(data) {
  const errors = {};

  if (!data.title) {
    errors.title = "Title is required";
  }

  if (!data.productId) {
    errors.productId = "Product is required";
  }

  if (!data.destination) {
    errors.destination = "Destination is required";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}