import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import { FaCreditCard, FaLock, FaCheckCircle, FaInfoCircle, FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ event, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: event.eventFee * 100, // Convert to cents
          eventId: event.id,
          clubId: event.clubId,
          userEmail: user.email,
          type: "event",
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Create event registration
        await fetch("/api/event-registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.id,
            userEmail: user.email,
            clubId: event.clubId,
            status: "registered",
            paymentId: paymentIntent.id,
            registeredAt: new Date().toISOString(),
          }),
        });

        // Record payment
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: user.email,
            amount: event.eventFee,
            type: "event",
            clubId: event.clubId,
            eventId: event.id,
            stripePaymentIntentId: paymentIntent.id,
            status: "completed",
            createdAt: new Date().toISOString(),
          }),
        });

        toast.success("Registration successful! See you at the event!");
        onSuccess();
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <FaLock />
        {processing ? "Processing..." : `Pay $${event.eventFee}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secure and encrypted
      </p>
    </form>
  );
};

const EventPayment = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch event details
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch event");
      return response.json();
    },
  });

  const handleSuccess = () => {
    navigate(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const spotsLeft = event?.maxAttendees
    ? event.maxAttendees - (event.registrations || 0)
    : "Unlimited";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register for Event
          </h1>
          <p className="text-gray-600">Complete your event registration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {event?.title}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  {event?.clubName}
                </p>
              </div>

              <p className="text-gray-600">{event?.description}</p>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm">
                      {new Date(event?.eventDate).toLocaleDateString()} at{" "}
                      {event?.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm">{event?.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaUsers className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Availability</p>
                    <p className="text-sm">
                      {spotsLeft} spots {typeof spotsLeft === "number" ? "left" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Event Fee</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${event?.eventFee}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Registration Includes:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    Event admission
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    Access to all activities
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    Event materials
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    Certificate of attendance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaCreditCard className="text-2xl text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Secure Payment
                </p>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We use Stripe
                  for payment processing.
                </p>
              </div>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm event={event} onSuccess={handleSuccess} />
            </Elements>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By completing this registration, you agree to our Terms of Service
                and Event Cancellation Policy. Refunds available up to 48 hours
                before the event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPayment;
