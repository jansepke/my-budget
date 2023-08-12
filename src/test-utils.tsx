import { Transaction } from "@/domain";
import { render } from "@testing-library/react";

export const createCustomRender =
  <T,>(Comp: React.FC<T>, defaultProps: T) =>
  (props: Partial<T> = {}) => {
    const mergedProps = { ...defaultProps, ...props };

    const { unmount } = render(<Comp {...mergedProps} />);

    return { unmount, ...mergedProps };
  };

export const mockTransaction = (t: Partial<Transaction>): Transaction => ({
  amount: 0,
  category: "",
  date: 1,
  description: "",
  from: 1,
  to: 0,
  ...t,
});
