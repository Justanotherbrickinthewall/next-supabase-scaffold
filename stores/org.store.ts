import { create } from 'zustand';

type OrgState = {
  organizationId?: string;
  organizationName?: string;
  setOrg: (id?: string, name?: string) => void;
  clearOrg: () => void;
};

export const useOrgStore = create<OrgState>((set) => ({
  organizationId: undefined,
  organizationName: undefined,
  setOrg: (organizationId, organizationName) => set({ organizationId, organizationName }),
  clearOrg: () => set({ organizationId: undefined, organizationName: undefined }),
}));


