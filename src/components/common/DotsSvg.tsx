const DotsSvg = (props: any) => {
  const { color } = props;
  //   "#041724"
  return (
    <svg width='4' height='14' viewBox='0 0 4 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M2.00016 7.66634C2.36835 7.66634 2.66683 7.36786 2.66683 6.99967C2.66683 6.63148 2.36835 6.33301 2.00016 6.33301C1.63197 6.33301 1.3335 6.63148 1.3335 6.99967C1.3335 7.36786 1.63197 7.66634 2.00016 7.66634Z'
        fill={color}
        stroke={color}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M2.00016 3.00033C2.36835 3.00033 2.66683 2.70185 2.66683 2.33366C2.66683 1.96547 2.36835 1.66699 2.00016 1.66699C1.63197 1.66699 1.3335 1.96547 1.3335 2.33366C1.3335 2.70185 1.63197 3.00033 2.00016 3.00033Z'
        fill={color}
        stroke={color}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M2.00016 12.3333C2.36835 12.3333 2.66683 12.0349 2.66683 11.6667C2.66683 11.2985 2.36835 11 2.00016 11C1.63197 11 1.3335 11.2985 1.3335 11.6667C1.3335 12.0349 1.63197 12.3333 2.00016 12.3333Z'
        fill={color}
        stroke={color}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};

export default DotsSvg;
