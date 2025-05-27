// services/perf.ts
import perf from "@react-native-firebase/perf";

export const tracePerformance = async <T>(
  traceName: string,
  fn: () => Promise<T>
): Promise<T> => {
  const trace = await perf().startTrace(traceName);
  try {
    const result = await fn();
    await trace.stop();
    return result;
  } catch (error) {
    await trace.stop();
    throw error;
  }
};
