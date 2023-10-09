import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean; // "shouldFromat" to decide whether we want to format the value, because if it's totalRevenue I want it formattd in dollars
}

export const DataCard = ({ value, label, shouldFormat }: DataCardProps) => {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {shouldFormat ? formatPrice(value) : value}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
