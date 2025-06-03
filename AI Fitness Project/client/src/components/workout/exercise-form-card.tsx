import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseFormGuide {
  exerciseName: string;
  steps: string[];
  keyPoints: string[];
  commonMistakes: string[];
  beginnerModifications: string[];
}

interface ExerciseFormCardProps {
  formGuide?: ExerciseFormGuide;
}

export default function ExerciseFormCard({ formGuide }: ExerciseFormCardProps) {
  // Default exercise form guide if none is provided
  const defaultGuide: ExerciseFormGuide = {
    exerciseName: "Goblet Squat",
    steps: [
      "Hold a kettlebell or dumbbell close to your chest with both hands, elbows pointing down.",
      "Stand with feet slightly wider than shoulder-width apart, toes pointed slightly outward.",
      "Keeping your chest up and core engaged, push your hips back and bend your knees to lower into a squat.",
      "Lower until thighs are parallel to the ground (or as low as is comfortable with good form).",
      "Push through your heels to return to the starting position."
    ],
    keyPoints: [
      "Keep weight in mid-foot and heels (not toes)",
      "Maintain a neutral spine throughout the movement",
      "Knees should track over toes, not caving inward",
      "Brace your core throughout the exercise"
    ],
    commonMistakes: [
      "Letting the knees cave inward",
      "Rounding the lower back",
      "Lifting heels off the ground",
      "Not reaching proper depth"
    ],
    beginnerModifications: [
      "Use a chair or bench to squat to",
      "Reduce weight or use bodyweight only",
      "Decrease range of motion until flexibility improves",
      "Hold onto a stable surface for balance"
    ]
  };

  // Use provided guide or fall back to default
  const guide = formGuide || defaultGuide;

  return (
    <Card className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden mt-2 mb-2">
      <CardHeader className="bg-primary text-white p-3">
        <CardTitle className="font-medium text-sm">{guide.exerciseName} Form Guide</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {/* Exercise illustration */}
        <div className="rounded w-full h-32 mb-3 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
          <span className="material-icons text-primary text-6xl">fitness_center</span>
        </div>
        
        <h4 className="font-medium text-sm mb-1">Steps:</h4>
        <ol className="list-decimal pl-5 space-y-1 mb-3 text-xs">
          {guide.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        
        <h4 className="font-medium text-sm mb-1">Key Form Points:</h4>
        <ul className="space-y-1 mb-3">
          {guide.keyPoints.map((point, index) => (
            <li className="flex items-start" key={index}>
              <span className="material-icons text-primary mr-1 text-sm mt-0.5">check_circle</span>
              <span className="text-xs">{point}</span>
            </li>
          ))}
        </ul>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1">Common Mistakes:</h4>
            <ul className="space-y-1 mb-2">
              {guide.commonMistakes.map((mistake, index) => (
                <li className="flex items-start" key={index}>
                  <span className="material-icons text-red-500 mr-1 text-sm mt-0.5">error</span>
                  <span className="text-xs">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-1">Beginner Modifications:</h4>
            <ul className="space-y-1">
              {guide.beginnerModifications.map((mod, index) => (
                <li className="flex items-start" key={index}>
                  <span className="material-icons text-accent mr-1 text-sm mt-0.5">tips_and_updates</span>
                  <span className="text-xs">{mod}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs"
        >
          <span className="material-icons mr-1 text-sm">play_circle</span>
          Watch Video Demo
        </Button>
      </CardContent>
    </Card>
  );
}
