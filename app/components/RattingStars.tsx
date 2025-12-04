import React from "react";

type Props = {
  rate: number;
  count: number;
};

function RattingStars({ rate, count }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index}>
          {index < Math.round(rate) ? (
            <svg
              className="w-[14px] h-[14px] fill-blue-600"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
            </svg>
          ) : (
            <svg
              className="w-[14px] h-[14px] fill-[#CED5D8]"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
            </svg>
          )}
        </div>
      ))}
      {count > 0 && (
        <span className="text-xs text-gray-600 ml-1">({count})</span>
      )}
    </div>
  );
}

export default RattingStars;
