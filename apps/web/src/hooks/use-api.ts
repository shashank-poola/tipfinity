import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, CreateCreatorInput, UpdateCreatorInput, CreateTipInput, WalletLinkInput } from '@/lib/api';

// Query keys
export const queryKeys = {
  creators: ['creators'] as const,
  creator: (id: number) => ['creators', id] as const,
  usernameAvailability: (username: string) => ['username', username, 'availability'] as const,
  tips: ['tips'] as const,
  tipsForCreator: (creatorId: number) => ['tips', 'creator', creatorId] as const,
  recentTips: ['tips', 'recent'] as const,
  health: ['health'] as const,
};

// Creator hooks
export const useCreators = () => {
  return useQuery({
    queryKey: queryKeys.creators,
    queryFn: () => apiClient.getCreators(),
  });
};

export const useCreator = (id: number) => {
  return useQuery({
    queryKey: queryKeys.creator(id),
    queryFn: () => apiClient.getCreator(id),
    enabled: !!id,
  });
};

export const useCreateCreator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateCreatorInput) => apiClient.createCreator(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creators });
    },
  });
};

export const useUpdateCreator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCreatorInput }) => 
      apiClient.updateCreator(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creator(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.creators });
    },
  });
};

export const useDeleteCreator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteCreator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creators });
    },
  });
};

export const useUsernameAvailability = (username: string) => {
  return useQuery({
    queryKey: queryKeys.usernameAvailability(username),
    queryFn: () => apiClient.checkUsernameAvailability(username),
    enabled: !!username && username.length > 0,
  });
};

// Wallet hooks
export const useLinkWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: WalletLinkInput) => apiClient.linkWallet(input),
    onSuccess: (_, { creator_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creator(creator_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.creators });
    },
  });
};

// Tip hooks
export const useCreateTip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateTipInput) => apiClient.createTip(input),
    onSuccess: (_, { creator_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tipsForCreator(creator_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTips });
      queryClient.invalidateQueries({ queryKey: queryKeys.tips });
    },
  });
};

export const useTipsForCreator = (creatorId: number) => {
  return useQuery({
    queryKey: queryKeys.tipsForCreator(creatorId),
    queryFn: () => apiClient.getTipsForCreator(creatorId),
    enabled: !!creatorId,
  });
};

export const useRecentTips = () => {
  return useQuery({
    queryKey: queryKeys.recentTips,
    queryFn: () => apiClient.getRecentTips(),
  });
};

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 30000, // Check every 30 seconds
  });
};
