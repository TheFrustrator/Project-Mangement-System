import { fetchData, updateData } from "@/lib/fetch-utils";
import { useAuth } from "@/provider/auth-context";
import type {
  ChangePasswordFormData,
  ProfileFormData,
} from "@/routes/user/profile";
import { useMutation, useQuery, type QueryKey } from "@tanstack/react-query";


const queryKey: QueryKey = ["user"];

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey,
    queryFn: () => fetchData("/users/profile"),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      updateData("/users/change-password", data),
  });
};

export const useUpdateUserProfile = () => {
  const { setUser } = useAuth();
  
  return useMutation({
    mutationFn: (data: ProfileFormData) => updateData("users/profile", data),
    
  });
};

// export const uploadImage = async (file: File): Promise<string> => {
//   // For demo: simulate async upload
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(URL.createObjectURL(file)); // simulate using local URL
//     }, 1000);
//   });

//   // Or use Firebase, S3, etc.
// };
