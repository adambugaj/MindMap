import React, { createContext, useContext, useState, useEffect } from "react";
import { Domain, DEFAULT_TASKS, Task } from "@/types/domain";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface DomainContextType {
  domains: Domain[];
  addDomain: (domain: Omit<Domain, "id" | "createdAt" | "tasks">) => void;
  addBulkDomains: (
    domains: Omit<Domain, "id" | "createdAt" | "tasks">[],
  ) => void;
  updateDomain: (domain: Domain) => void;
  updateDomainPosition: (
    id: string,
    position: { x: number; y: number },
  ) => void;
  updateTaskStatus: (
    domainId: string,
    taskId: string,
    completed: boolean,
  ) => void;
  updateDomainTasks: (domainId: string, tasks: Task[]) => void;
  removeDomainTask: (domainId: string, taskId: string) => void;
  removeDomain: (id: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function useDomainContext() {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error("useDomainContext must be used within a DomainProvider");
  }
  return context;
}

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch domains from Supabase on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const { data, error } = await supabase
          .from("domains")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching domains:", error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Transform the data to match our Domain type
          const transformedDomains = data.map((domain) => ({
            id: domain.id,
            name: domain.name,
            url: domain.url,
            position: { x: domain.position_x || 0, y: domain.position_y || 0 },
            tasks: DEFAULT_TASKS, // Use default tasks since the column doesn't exist
            createdAt: domain.created_at,
          }));
          setDomains(transformedDomains);
          setLoading(false);
        } else {
          // If no domains in database, add default domains
          const defaultDomains = [
            {
              id: uuidv4(),
              name: "finansowyplac.pl",
              url: "https://finansowyplac.pl",
              position: { x: 50, y: 100 },
              tasks: DEFAULT_TASKS,
              createdAt: new Date().toISOString(),
            },
            {
              id: uuidv4(),
              name: "kredytjuzdzis.pl",
              url: "https://kredytjuzdzis.pl",
              position: { x: 350, y: 100 },
              tasks: DEFAULT_TASKS,
              createdAt: new Date().toISOString(),
            },
          ];

          // Add default domains to Supabase
          const supabaseDomains = defaultDomains.map((domain) => ({
            id: domain.id,
            name: domain.name,
            url: domain.url,
            position: domain.position,
            tasks: domain.tasks,
            created_at: domain.createdAt,
          }));

          try {
            const { error: insertError } = await supabase
              .from("domains")
              .insert(supabaseDomains);

            if (insertError) {
              console.error(
                "Error adding default domains to Supabase:",
                insertError,
              );
            }

            setDomains(defaultDomains);
          } catch (insertErr) {
            console.error("Error inserting domains:", insertErr);
            // Try to fetch domains again in case they were added by another process
            const { data: refetchData } = await supabase
              .from("domains")
              .select("*")
              .order("created_at", { ascending: false });

            if (refetchData && refetchData.length > 0) {
              const transformedDomains = refetchData.map((domain) => ({
                id: domain.id,
                name: domain.name,
                url: domain.url,
                position: {
                  x: domain.position_x || 0,
                  y: domain.position_y || 0,
                },
                tasks: DEFAULT_TASKS,
                createdAt: domain.created_at,
              }));
              setDomains(transformedDomains);
            } else {
              setDomains(defaultDomains);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchDomains:", error);
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  // Sync domains with Supabase whenever they change
  useEffect(() => {
    // Skip on initial load when domains are being fetched
    if (loading) return;

    // We don't need to sync here as each individual operation will update Supabase
  }, [domains, loading]);

  const addDomain = async (
    domain: Omit<Domain, "id" | "createdAt" | "tasks">,
  ) => {
    const newDomain: Domain = {
      ...domain,
      id: uuidv4(),
      tasks: DEFAULT_TASKS,
      createdAt: new Date().toISOString(),
    };

    try {
      // Add to Supabase
      const { error } = await supabase.from("domains").insert({
        id: newDomain.id,
        name: newDomain.name,
        url: newDomain.url,
        position_x: newDomain.position.x,
        position_y: newDomain.position.y,
        created_at: newDomain.createdAt,
        category: "general",
      });

      if (error) {
        console.error("Error adding domain to Supabase:", error);
        return;
      }

      // Update local state
      setDomains([...domains, newDomain]);
    } catch (error) {
      console.error("Error in addDomain:", error);
    }
  };

  const updateDomain = async (updatedDomain: Domain) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from("domains")
        .update({
          name: updatedDomain.name,
          url: updatedDomain.url,
          position_x: updatedDomain.position.x,
          position_y: updatedDomain.position.y,
        })
        .eq("id", updatedDomain.id);

      if (error) {
        console.error("Error updating domain in Supabase:", error);
        return;
      }

      // Update local state
      setDomains(
        domains.map((domain) =>
          domain.id === updatedDomain.id ? updatedDomain : domain,
        ),
      );
    } catch (error) {
      console.error("Error in updateDomain:", error);
    }
  };

  const updateDomainPosition = async (
    id: string,
    position: { x: number; y: number },
  ) => {
    try {
      // Update position in Supabase
      const { error } = await supabase
        .from("domains")
        .update({ position_x: position.x, position_y: position.y })
        .eq("id", id);

      if (error) {
        console.error("Error updating domain position in Supabase:", error);
        return;
      }

      // Update local state
      setDomains(
        domains.map((domain) =>
          domain.id === id ? { ...domain, position } : domain,
        ),
      );
    } catch (error) {
      console.error("Error in updateDomainPosition:", error);
    }
  };

  const updateTaskStatus = async (
    domainId: string,
    taskId: string,
    completed: boolean,
  ) => {
    try {
      // Find the domain and update the task
      const domain = domains.find((d) => d.id === domainId);
      if (!domain) return;

      const updatedTasks = domain.tasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task,
      );

      // Store tasks in local state only since the tasks column doesn't exist in the database
      // No Supabase update needed for tasks

      // Update local state
      setDomains(
        domains.map((domain) => {
          if (domain.id === domainId) {
            return {
              ...domain,
              tasks: updatedTasks,
            };
          }
          return domain;
        }),
      );
    } catch (error) {
      console.error("Error in updateTaskStatus:", error);
    }
  };

  const updateDomainTasks = async (domainId: string, tasks: Task[]) => {
    try {
      // Store tasks in local state only since the tasks column doesn't exist in the database
      // No Supabase update needed for tasks

      // Update local state
      setDomains(
        domains.map((domain) => {
          if (domain.id === domainId) {
            return {
              ...domain,
              tasks,
            };
          }
          return domain;
        }),
      );
    } catch (error) {
      console.error("Error in updateDomainTasks:", error);
    }
  };

  const removeDomainTask = async (domainId: string, taskId: string) => {
    try {
      // Find the domain and filter out the task
      const domain = domains.find((d) => d.id === domainId);
      if (!domain) return;

      const updatedTasks = domain.tasks.filter((task) => task.id !== taskId);

      // Store tasks in local state only since the tasks column doesn't exist in the database
      // No Supabase update needed for tasks

      // Update local state
      setDomains(
        domains.map((domain) => {
          if (domain.id === domainId) {
            return {
              ...domain,
              tasks: updatedTasks,
            };
          }
          return domain;
        }),
      );
    } catch (error) {
      console.error("Error in removeDomainTask:", error);
    }
  };

  const removeDomain = async (id: string) => {
    try {
      // Remove from Supabase
      const { error } = await supabase.from("domains").delete().eq("id", id);

      if (error) {
        console.error("Error removing domain from Supabase:", error);
        return;
      }

      // Update local state
      setDomains(domains.filter((domain) => domain.id !== id));
    } catch (error) {
      console.error("Error in removeDomain:", error);
    }
  };

  const addBulkDomains = async (
    domainsToAdd: Omit<Domain, "id" | "createdAt" | "tasks">[],
  ) => {
    try {
      const newDomains: Domain[] = domainsToAdd.map((domain) => ({
        ...domain,
        id: uuidv4(),
        tasks: DEFAULT_TASKS,
        createdAt: new Date().toISOString(),
      }));

      // Add to Supabase in a single batch
      const supabaseDomains = newDomains.map((domain) => ({
        id: domain.id,
        name: domain.name,
        url: domain.url,
        position_x: domain.position.x,
        position_y: domain.position.y,
        created_at: domain.createdAt,
        category: "general",
      }));

      const { error } = await supabase.from("domains").insert(supabaseDomains);

      if (error) {
        console.error("Error adding bulk domains to Supabase:", error);
        return;
      }

      // Update local state
      setDomains([...domains, ...newDomains]);
    } catch (error) {
      console.error("Error in addBulkDomains:", error);
    }
  };

  return (
    <DomainContext.Provider
      value={{
        domains,
        addDomain,
        addBulkDomains,
        updateDomain,
        updateDomainPosition,
        updateTaskStatus,
        updateDomainTasks,
        removeDomainTask,
        removeDomain,
      }}
    >
      {loading ? <div>Loading domains...</div> : children}
    </DomainContext.Provider>
  );
}
