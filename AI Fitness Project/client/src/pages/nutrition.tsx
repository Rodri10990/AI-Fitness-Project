import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function Nutrition() {
  // Sample data for macros
  const macroData = [
    { name: "Protein", value: 35, color: "#8884d8" },
    { name: "Carbs", value: 45, color: "#82ca9d" },
    { name: "Fat", value: 20, color: "#ffc658" }
  ];

  // Sample meal plan data
  const mealPlan = [
    {
      meal: "Breakfast",
      items: [
        { name: "Scrambled Eggs", protein: "12g", carbs: "1g", fat: "8g", calories: 180 },
        { name: "Whole Wheat Toast", protein: "4g", carbs: "15g", fat: "2g", calories: 120 },
        { name: "Avocado", protein: "1g", carbs: "4g", fat: "10g", calories: 120 }
      ]
    },
    {
      meal: "Lunch",
      items: [
        { name: "Grilled Chicken Breast", protein: "25g", carbs: "0g", fat: "3g", calories: 165 },
        { name: "Brown Rice", protein: "5g", carbs: "45g", fat: "2g", calories: 218 },
        { name: "Steamed Vegetables", protein: "2g", carbs: "10g", fat: "0g", calories: 50 }
      ]
    },
    {
      meal: "Dinner",
      items: [
        { name: "Salmon Fillet", protein: "22g", carbs: "0g", fat: "12g", calories: 208 },
        { name: "Sweet Potato", protein: "2g", carbs: "24g", fat: "0g", calories: 112 },
        { name: "Mixed Salad", protein: "1g", carbs: "5g", fat: "0g", calories: 25 }
      ]
    },
    {
      meal: "Snacks",
      items: [
        { name: "Protein Shake", protein: "25g", carbs: "3g", fat: "1g", calories: 120 },
        { name: "Greek Yogurt", protein: "15g", carbs: "7g", fat: "0g", calories: 100 },
        { name: "Almonds (1oz)", protein: "6g", carbs: "6g", fat: "14g", calories: 164 }
      ]
    }
  ];

  // Sample food log data
  const foodLog = [
    { 
      date: "Today", 
      totalCalories: 1850,
      goalCalories: 2200,
      items: [
        { time: "7:30 AM", name: "Scrambled Eggs & Toast", calories: 300 },
        { time: "10:00 AM", name: "Protein Shake", calories: 120 },
        { time: "12:30 PM", name: "Chicken & Rice Bowl", calories: 450 },
        { time: "3:30 PM", name: "Greek Yogurt with Berries", calories: 180 },
        { time: "7:00 PM", name: "Salmon with Sweet Potato & Salad", calories: 350 },
        { time: "9:00 PM", name: "Almonds (1oz)", calories: 164 }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Nutrition</h1>
        <Button className="bg-primary">
          <span className="material-icons mr-2">add</span>
          Log Food
        </Button>
      </div>
      
      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
          <TabsTrigger value="food-log">Food Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Macros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Targets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-neutral-300">1850 / 2200</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-neutral-300">138g / 165g</span>
                  </div>
                  <Progress value={83} className="h-2 bg-neutral-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Carbs</span>
                    <span className="text-sm text-neutral-300">158g / 200g</span>
                  </div>
                  <Progress value={79} className="h-2 bg-neutral-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm text-neutral-300">48g / 60g</span>
                  </div>
                  <Progress value={80} className="h-2 bg-neutral-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Water</span>
                    <span className="text-sm text-neutral-300">1.8L / 3L</span>
                  </div>
                  <Progress value={60} className="h-2 bg-neutral-200" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NutritionCard title="Daily Average" value="2150 calories" text="Last 7 days" />
            <NutritionCard title="Protein" value="140g" text="35% of total intake" />
            <NutritionCard title="Water" value="2.5L" text="83% of daily target" />
          </div>
        </TabsContent>
        
        <TabsContent value="meal-plan">
          <div className="space-y-6">
            {mealPlan.map((meal, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle>{meal.meal}</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead className="text-left text-sm text-neutral-300">
                      <tr>
                        <th className="pb-2">Food</th>
                        <th className="pb-2 text-right">Protein</th>
                        <th className="pb-2 text-right">Carbs</th>
                        <th className="pb-2 text-right">Fat</th>
                        <th className="pb-2 text-right">Calories</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meal.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="border-t border-neutral-100">
                          <td className="py-3">{item.name}</td>
                          <td className="py-3 text-right">{item.protein}</td>
                          <td className="py-3 text-right">{item.carbs}</td>
                          <td className="py-3 text-right">{item.fat}</td>
                          <td className="py-3 text-right">{item.calories}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="food-log">
          <div className="space-y-6">
            {foodLog.map((day, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{day.date}</CardTitle>
                    <div className="text-sm">
                      <span className="font-medium">{day.totalCalories}</span>
                      <span className="text-neutral-300"> / {day.goalCalories} calories</span>
                    </div>
                  </div>
                  <Progress value={(day.totalCalories / day.goalCalories) * 100} className="h-2 mt-2" />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {day.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex justify-between py-2 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-neutral-300">{item.time}</p>
                        </div>
                        <div className="text-right">
                          <p>{item.calories} cal</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NutritionCard({ title, value, text }: { title: string; value: string; text: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-neutral-300 mt-1">{text}</p>
      </CardContent>
    </Card>
  );
}