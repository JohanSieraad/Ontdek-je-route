import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Calendar, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Review } from "@shared/schema";

const reviewFormSchema = z.object({
  userName: z.string().min(2, "Naam moet minimaal 2 karakters bevatten"),
  userEmail: z.string().email("Ongeldig email adres").optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Titel moet minimaal 5 karakters bevatten"),
  comment: z.string().min(10, "Commentaar moet minimaal 10 karakters bevatten"),
  visitDate: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewsSectionProps {
  routeId: string;
  routeTitle: string;
}

export function ReviewsSection({ routeId, routeTitle }: ReviewsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/routes', routeId, 'reviews'],
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      rating: 5,
      title: "",
      comment: "",
      visitDate: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return await apiRequest(`/api/routes/${routeId}/reviews`, 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routes', routeId, 'reviews'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Review toegevoegd",
        description: "Bedankt voor je review! Deze wordt binnenkort gepubliceerd na moderatie.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het toevoegen van je review. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate(data);
  };

  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="reviews-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              {renderStars(Math.round(averageRating), "lg")}
              <span className="text-lg font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dutch-orange hover:bg-dutch-orange/90" data-testid="button-add-review">
              <Plus className="h-4 w-4 mr-2" />
              Review Schrijven
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review schrijven voor {routeTitle}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jouw naam" {...field} data-testid="input-user-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optioneel)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jouw@email.com" {...field} data-testid="input-user-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beoordeling *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue="5">
                        <FormControl>
                          <SelectTrigger data-testid="select-rating">
                            <SelectValue placeholder="Kies een beoordeling" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ Uitstekend</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Goed</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Oké</SelectItem>
                          <SelectItem value="2">⭐⭐ Matig</SelectItem>
                          <SelectItem value="1">⭐ Slecht</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titel *</FormLabel>
                      <FormControl>
                        <Input placeholder="Korte samenvatting van je ervaring" {...field} data-testid="input-review-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Vertel over je ervaring met deze route..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-review-comment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bezoekdatum (optioneel)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-visit-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                    data-testid="button-cancel-review"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    disabled={createReviewMutation.isPending}
                    className="flex-1 bg-dutch-orange hover:bg-dutch-orange/90"
                    data-testid="button-submit-review"
                  >
                    {createReviewMutation.isPending ? "Bezig..." : "Review Plaatsen"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4" data-testid={`review-${review.id}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-dutch-orange/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-dutch-orange" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    {review.isVerified === 1 && (
                      <Badge variant="secondary" className="text-xs">
                        Geverifieerd
                      </Badge>
                    )}
                    {renderStars(review.rating)}
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {review.visitDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Bezocht op {new Date(review.visitDate).toLocaleDateString('nl-NL')}
                      </div>
                    )}
                    <span>
                      Geplaatst op {new Date(review.createdAt).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Nog geen reviews</p>
          <p className="text-sm">Wees de eerste om een review te schrijven voor deze route!</p>
        </div>
      )}
    </div>
  );
}