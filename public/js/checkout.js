/**
 * checkout js
 */

(async () => {
  // Set the publishable key
  const response1 = await fetch('/publishable');
  const { publishablekey: publishablekey } = await response1.json();
  const stripe = Stripe(publishablekey);

  //const response = await fetch('/secret');
  //const {client_secret: clientSecret} = await response.json();

  // Render the form using the clientSecret
  const clientSecret = document.getElementById('payment-form').getAttribute('data-secret');

  const elements = stripe.elements({clientSecret});

  // Create and mount the Payment Element
  const paymentElement = await elements.create('payment');
  paymentElement.mount('#payment-element');


  // await for submit
  const form = document.getElementById('payment-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/success',
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      const messageContainer = document.querySelector('#error-message');
      messageContainer.textContent = error.message;
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  });
  
})();