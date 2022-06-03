/**
 * status js
 */

 (async () => {
  // Set the publishable key
  const response1 = await fetch('/publishable');
  const { publishablekey: publishablekey } = await response1.json();
  const stripe = Stripe(publishablekey);

  // Retrieve the "payment_intent_client_secret" query parameter appended to
  // your return_url by Stripe.js
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  );

  // Retrieve the PaymentIntent
  stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
    const message = document.getElementById('#message')
    // Inspect the PaymentIntent `status` to indicate the status of the payment
    // to your customer.
    //
    // Some payment methods will [immediately succeed or fail][0] upon
    // confirmation, while others will first enter a `processing` state.
    //
    // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
    switch (paymentIntent.status) {
      case 'succeeded':
        message.innerHTML = 'Payment received. ' + 
          '<br />' +
          'Payment Intent ID: ' + paymentIntent.id +
          '<br />' +
          'Payment Amount: $' + ((paymentIntent.amount)/100).toFixed(2) +
          '<br />'

        break;

      case 'processing':
        message.innerText = "Payment processing. We'll update you when payment is received.";
        break;

      case 'requires_payment_method':
        message.innerText = 'Payment failed. Please try another payment method.';
        // Redirect your user back to your payment page to attempt collecting
        // payment again
        break;

      default:
        message.innerText = 'Something went wrong.';
        break;
    }
  });

})();