import { useEffect, useState } from "react";

// useDebounce это хук, который будет откладывать изменения значения переменной на промежуток времени.
// <T> - это дженерик, который позволяет создавать ф-ии и тд, которые могут работать с различными типами данных, а не только с конкретными (другими словами у меня в value могут быть и строки и числа)
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // clear timeout to prevent overflow
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
