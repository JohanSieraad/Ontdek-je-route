import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Plus, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Photo } from "@shared/schema";

const photoFormSchema = z.object({
  userName: z.string().min(2, "Naam moet minimaal 2 karakters bevatten"),
  caption: z.string().optional(),
  fileUrl: z.string().url("Voer een geldige foto URL in"),
  fileName: z.string().min(1, "Bestandsnaam is vereist"),
  originalName: z.string().min(1, "Originele naam is vereist"),
});

type PhotoFormData = z.infer<typeof photoFormSchema>;

interface PhotosSectionProps {
  routeId: string;
  routeTitle: string;
}

export function PhotosSection({ routeId, routeTitle }: PhotosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ['/api/routes', routeId, 'photos'],
  });

  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      userName: "",
      caption: "",
      fileUrl: "",
      fileName: "",
      originalName: "",
    },
  });

  const createPhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormData) => {
      return await apiRequest(`/api/routes/${routeId}/photos`, 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routes', routeId, 'photos'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Foto toegevoegd",
        description: "Bedankt voor het delen van je foto! Deze wordt binnenkort gepubliceerd na moderatie.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het uploaden van je foto. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PhotoFormData) => {
    createPhotoMutation.mutate(data);
  };

  const handlePhotoUrlChange = (url: string) => {
    if (url) {
      // Extract filename from URL for convenience
      const filename = url.split('/').pop() || 'photo.jpg';
      form.setValue('fileName', filename);
      form.setValue('originalName', filename);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="photos-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Foto's</h3>
          {photos && photos.length > 0 && (
            <p className="text-gray-500 mt-1">
              {photos.length} {photos.length === 1 ? 'foto' : "foto's"} gedeeld door reizigers
            </p>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dutch-orange hover:bg-dutch-orange/90" data-testid="button-add-photo">
              <Plus className="h-4 w-4 mr-2" />
              Foto Delen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Foto delen van {routeTitle}</DialogTitle>
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
                        <Input placeholder="Jouw naam" {...field} data-testid="input-photo-user-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto URL *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/foto.jpg"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handlePhotoUrlChange(e.target.value);
                          }}
                          data-testid="input-photo-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bijschrift (optioneel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beschrijf wat er op de foto te zien is..."
                          className="min-h-[80px]"
                          {...field}
                          data-testid="textarea-photo-caption"
                        />
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
                    data-testid="button-cancel-photo"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPhotoMutation.isPending}
                    className="flex-1 bg-dutch-orange hover:bg-dutch-orange/90"
                    data-testid="button-submit-photo"
                  >
                    {createPhotoMutation.isPending ? "Bezig..." : "Foto Delen"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-300"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : photos && photos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPhoto(photo)}
                data-testid={`photo-${photo.id}`}
              >
                <div className="aspect-square relative">
                  <img
                    src={photo.fileUrl}
                    alt={photo.caption || `Foto door ${photo.userName}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  {photo.caption && (
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{photo.caption}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{photo.userName}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Photo Modal */}
          {selectedPhoto && (
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPhoto.caption || `Foto door ${selectedPhoto.userName}`}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={selectedPhoto.fileUrl}
                      alt={selectedPhoto.caption || `Foto door ${selectedPhoto.userName}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {selectedPhoto.caption && (
                    <p className="text-gray-700">{selectedPhoto.caption}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedPhoto.userName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedPhoto.uploadedAt).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Nog geen foto's</p>
          <p className="text-sm">Deel jouw mooiste foto's van deze route met andere reizigers!</p>
        </div>
      )}
    </div>
  );
}