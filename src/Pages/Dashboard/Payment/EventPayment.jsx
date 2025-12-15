
import React, { useEffect,  useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import toast from 'react-hot-toast';
import { Navigate,  useSearchParams } from 'react-router';

const EventPayment = () => {
   const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
  if (sessionId) {
    axiosSecure.patch(`/event-payment-success?session_id=${sessionId}`)
      .then(res => {
        console.log(res.data);
        setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId : res.data.trackingId
                    })
        toast.success("Payment successful! Event registration confirmed");
      })
      .catch(() => {
        toast.error("Payment verification failed");
      });
  }
}, [sessionId]);

    return (
        <div>
            <h2 className="text-4xl">Payment successful</h2>
            <p>Your TransactionId: {paymentInfo.transactionId}</p>
            <p>Your Parcel Tracking id: {paymentInfo.trackingId}</p>
        </div>
    );
};

export default EventPayment;