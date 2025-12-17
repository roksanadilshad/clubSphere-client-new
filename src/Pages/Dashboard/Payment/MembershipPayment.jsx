// import { useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { AuthContext } from "../../Context/AuthContext";
// import { FaCreditCard, FaLock, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import toast from "react-hot-toast";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// const CheckoutForm = ({ club, onSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const { user } = useContext(AuthContext);
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     setProcessing(true);

//     try {
//       // Create payment intent
//       const response = await fetch("/api/payments/create-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: club.membershipFee * 100, // Convert to cents
//           clubId: club.id,
//           userEmail: user.email,
//           type: "membership",
//         }),
//       });

//       const { clientSecret } = await response.json();

//       // Confirm payment
//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: user.displayName,
//             email: user.email,
//           },
//         },
//       });

//       if (error) {
//         toast.error(error.message);
//       } else if (paymentIntent.status === "succeeded") {
//         // Create membership record
//         await fetch("/api/memberships", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userEmail: user.email,
//             clubId: club.id,
//             status: "active",
//             paymentId: paymentIntent.id,
//             joinedAt: new Date().toISOString(),
//             expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
//           }),
//         });

//         // Record payment
//         await fetch("/api/payments", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userEmail: user.email,
//             amount: club.membershipFee,
//             type: "membership",
//             clubId: club.id,
//             stripePaymentIntentId: paymentIntent.id,
//             status: "completed",
//             createdAt: new Date().toISOString(),
//           }),
//         });

//         toast.success("Payment successful! Welcome to the club!");
//         onSuccess();
//       }
//     } catch (error) {
//       toast.error("Payment failed. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Card Details
//         </label>
//         <div className="p-4 border border-gray-300 rounded-lg">
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: "16px",
//                   color: "#424770",
//                   "::placeholder": {
//                     color: "#aab7c4",
//                   },
//                 },
//                 invalid: {
//                   color: "#9e2146",
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={!stripe || processing}
//         className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//       >
//         <FaLock />
//         {processing ? "Processing..." : `Pay $${club.membershipFee}`}
//       </button>

//       <p className="text-xs text-gray-500 text-center">
//         Your payment is secure and encrypted
//       </p>
//     </form>
//   );
// };

// const MembershipPayment = () => {
//   const { clubId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   // Fetch club details
//   const { data: club, isLoading } = useQuery({
//     queryKey: ["club", clubId],
//     queryFn: async () => {
//       const response = await fetch(`/api/clubs/${clubId}`);
//       if (!response.ok) throw new Error("Failed to fetch club");
//       return response.json();
//     },
//   });

//   const handleSuccess = () => {
//     navigate(`/clubs/${clubId}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Join {club?.clubName}
//           </h1>
//           <p className="text-gray-600">Complete your membership payment</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Club Info */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Membership Details
//             </h2>

//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={club?.bannerImage || "https://via.placeholder.com/80"}
//                   alt={club?.clubName}
//                   className="w-20 h-20 rounded-lg object-cover"
//                 />
//                 <div>
//                   <h3 className="font-bold text-gray-900">{club?.clubName}</h3>
//                   <p className="text-sm text-gray-600">{club?.category}</p>
//                 </div>
//               </div>

//               <div className="pt-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-gray-600">Membership Fee</span>
//                   <span className="text-2xl font-bold text-gray-900">
//                     ${club?.membershipFee}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500">Per month</p>
//               </div>

//               <div className="pt-4 border-t border-gray-200">
//                 <h4 className="font-semibold text-gray-900 mb-2">
//                   What's Included:
//                 </h4>
//                 <ul className="space-y-2">
//                   <li className="flex items-center gap-2 text-sm text-gray-600">
//                     <FaCheckCircle className="text-green-500" />
//                     Access to all club events
//                   </li>
//                   <li className="flex items-center gap-2 text-sm text-gray-600">
//                     <FaCheckCircle className="text-green-500" />
//                     Member-only content
//                   </li>
//                   <li className="flex items-center gap-2 text-sm text-gray-600">
//                     <FaCheckCircle className="text-green-500" />
//                     Community networking
//                   </li>
//                   <li className="flex items-center gap-2 text-sm text-gray-600">
//                     <FaCheckCircle className="text-green-500" />
//                     Priority event registration
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Payment Form */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <FaCreditCard className="text-2xl text-blue-600" />
//               <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
//             </div>

//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
//               <FaInfoCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-sm text-blue-900 font-medium mb-1">
//                   Secure Payment
//                 </p>
//                 <p className="text-sm text-blue-700">
//                   Your payment information is encrypted and secure. We use Stripe
//                   for payment processing.
//                 </p>
//               </div>
//             </div>

//             <Elements stripe={stripePromise}>
//               <CheckoutForm club={club} onSuccess={handleSuccess} />
//             </Elements>

//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <p className="text-xs text-gray-500 text-center">
//                 By completing this purchase, you agree to our Terms of Service and
//                 Privacy Policy. Your membership will auto-renew monthly.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MembershipPayment;
import React, { useEffect,  useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import toast from 'react-hot-toast';
import { Navigate,  useNavigate,  useSearchParams } from 'react-router';

const MembershipPayment = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();

    const [paymentInfo, setPaymentInfo] = useState({});
    

    
    useEffect(() => {
      const sessionId = searchParams.get('session_id');
  if (sessionId) {
    axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
      .then(res => {
        console.log(res.data);
        setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId : res.data.trackingId
                    })

        toast.success("Payment successful! Membership activated");
         setTimeout(() => {
          navigate("/dashboard/payment-success");
        }, 2000);
      })
      .catch(() => {
        toast.error("Payment verification failed");
      });
  }
}, []);

    return (
        <div>
            <h2 className="text-4xl">Payment successful</h2>
            <p>Your TransactionId: {paymentInfo.transactionId}</p>
            <p>Your Tracking id: {paymentInfo.trackingId}</p>
        </div>
    );
};

export default MembershipPayment;