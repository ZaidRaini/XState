import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LocationSelector from "./LocationSelector";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <LocationSelector />
      </div>
    </QueryClientProvider>
  );
}

export default App;
