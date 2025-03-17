import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>PBN Domain Mind Map</CardTitle>
          <CardDescription>
            Visualize and manage your PBN domains with an interactive mind map
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track domain status, visualize task dependencies, and manage your
            entire PBN network from one central dashboard.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Home;
