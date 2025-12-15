import { useAppDispatch } from "../hooks/hook";
import { undoLast } from "../hooks/redux/slice/cartSlice";


interface SummaryProps {
  subtotal: number;
  thresholdDiscount: number;
  couponDiscount: number;
  total: number;
  setCoupon: (v: string) => void;
}

export default function Summary({
  subtotal,
  thresholdDiscount,
  couponDiscount,
  total,
  setCoupon,
}: SummaryProps) {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="mt-4 space-y-1">
        <p>Subtotal: ₹{subtotal}</p>
        <p>Threshold Discount: -₹{thresholdDiscount.toFixed(2)}</p>
        <p>Coupon Discount: -₹{couponDiscount.toFixed(2)}</p>
        <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Coupon"
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
        />

        <button
          className="border px-3 py-2 rounded"
          onClick={() => dispatch(undoLast())}
        >
          Undo Last
        </button>
      </div>
    </>
  );
}
