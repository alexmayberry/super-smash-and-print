import {useEffect, useState} from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  Heading,
  Box,
  Image,
  Select,
  Link
} from '@shopify/ui-extensions-react/admin';

import { createCanvas, loadImage } from 'canvas';
import { jsPDF } from 'jspdf'


// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.action.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n, close, and data.
  const {extension: {target}, i18n, close, data} = useApi(TARGET);

  const [productTitle, setProductTitle] = useState('');
  const [productVendor, setProductVendor] = useState('');
  const [productType, setProductType] = useState('');
  const [productVariants, setProductVariants] = useState([]);
  const [variantPickerOptions, setVariantPickerOptions] = useState([]);
  const [multipleVariants, setMultipleVariants] = useState(false);
  const [barcode, setBarcode] = useState();

  // test to send the response object through
  const [response, setResponse] = useState({});

  // Picker functions
  const [template, setTemplate] = useState('1');
  const [variant, setVariant] = useState();
  
  
  
  // Use direct API calls to fetch data from Shopify.
  // See https://shopify.dev/docs/api/admin-graphql for more information about Shopify's GraphQL API
  useEffect(() => {
    (async function getProductInfo() {
      const getProductQuery = {
        query: `query Product($id: ID!) {
          product(id: $id) {
            title
            productType
            vendor
            variants(first: 100) {
              nodes {
                barcode
                title
              }
            }
          }
        }`,
        variables: {id: data.selected[0].id},
      };

      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(getProductQuery),
      });

      if (!res.ok) {
        console.error('Network error');
      }
      
      const productData = await res.json();


      // // this is a hack. I should really figure out how to push 
      // let productVariantsArr = []
      // for (let i = 0; i > productData.data.product.variants.nodes.length; i++) {
        //   productVariantsArr.push({ title: productData.data.product.variants.nodes[i].title, barcode: productData.data.product.variants.nodes[i].barcode })
        // }
        
        setProductTitle(productData.data.product.title);
        setProductVendor(productData.data.product.vendor);
        setProductType(productData.data.product.productType);
        setProductVariants(productData.data.product.variants.nodes)
        setVariant(productData.data.product.variants.nodes[0].barcode);
        productData.data.product.variants.nodes.length > 1 ? setMultipleVariants(true) : null;

        // const mappedVariants = mapVariantOptions(productVariants);
        // console.log("product ", productData.data.product);
        // productVariants != undefined && mappedVariants != undefined ? console.log("product variants: ", productVariants, "Mapped Vairants ", mappedVariants) : console.log("no productVariants yet")
        // setVariantPickerOptions(mapVariantOptions)
        
        setResponse(productData);
      })();
    }, []);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');

    const date = `${mm}-${dd}-${yyyy} ${hh}:${min}`;
    
    const options = productVariants.map(function(variant, index) { 
        let barcode = String(variant.barcode).padStart(6, '0');
        return { value: barcode, label: variant.title } 
      });

    var doc = new jsPDF();
    var barcodeUrl = '';
    var pdfUrl = 'testpdfurl';

    const makeLabel = () => {
      console.log('Printin');
      pdfUrl = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
      barcodeUrl = `https://barcodeapi.org/api/code128/${variant}`

      doc.setFontSize(40);
      doc.text("Octonyan loves jsPDF", 35, 25);
      doc.addImage("https://barcodeapi.org/api/code128/2222", "JPEG", 15, 40, 180, 180);
      doc.save('test.pdf');
    }

    const printLabel = () => {
      doc mr
    }


  return (
    // The AdminAction component provides an API for setting the title and actions of the Action extension wrapper.
    <AdminAction
      primaryAction={
        <Button
        onPress={() => {
          makeLabel();
          console.log("printed");
          console.log(barcodeUrl);
          console.log(doc);
        }}
        >
          Print!
        </Button>
      }
      secondaryAction={
        <Button
          onPress={() => {
            printLabel()
            console.log(barcodeUrl);
            close();
          }}
        >
          close (esc)
        </Button>
      }
    >
      <BlockStack>
        {/* Set the translation values for each supported language in the locales directory */}
        <Heading>{productTitle}</Heading>
        <Text>Vendor: {productVendor}</Text>
      </BlockStack>
      <Select 
        label='Template'
        value={template}
        onChange={setTemplate}
        options={[
          {
            value: '1',
            label: '1x1 label',
          },
          {
            value: '2',
            label: 'other label templates coming in v2 of this app'
          }
        ]}
      >

      </Select>
      { multipleVariants ? ( 
        <Select
          label='Variant'
          value={variant}
          onChange={setVariant}
          options={options}
        > 
        </Select>
       ) : ( "not" 
       + "test" 
       ) }
       {/* { productVariants.forEach((variant) => { <p> {variant.title} </p>}) } */}
      <Box blockSize={20} maxBlockSize={20} >
        {pdfUrl}
          <Image source={`https://barcodeapi.org/api/code128/${variant}`} alt='product barcode' loading='lazy'/>
      </Box>
    </AdminAction>
  );
}