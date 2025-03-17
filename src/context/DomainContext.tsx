import React, { createContext, useContext, useState, useEffect } from "react";
import { Domain, DEFAULT_TASKS, Task } from "@/types/domain";

interface DomainContextType {
  domains: Domain[];
  addDomain: (domain: Omit<Domain, "id" | "createdAt" | "tasks">) => void;
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

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error("useDomainContext must be used within a DomainProvider");
  }
  return context;
};

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [domains, setDomains] = useState<Domain[]>(() => {
    const savedDomains = localStorage.getItem("domains");
    return savedDomains
      ? JSON.parse(savedDomains)
      : [
          {
            id: "1",
            name: "finansowyplac.pl",
            url: "https://finansowyplac.pl",
            position: { x: 50, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "kredytjuzdzis.pl",
            url: "https://kredytjuzdzis.pl",
            position: { x: 350, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "kredytoweprzypadki.pl",
            url: "https://kredytoweprzypadki.pl",
            position: { x: 650, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "4",
            name: "kredytnazycie.pl",
            url: "https://kredytnazycie.pl",
            position: { x: 950, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "5",
            name: "toseemore.pl",
            url: "https://toseemore.pl",
            position: { x: 1250, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "6",
            name: "access-technology.net",
            url: "https://access-technology.net",
            position: { x: 1550, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "7",
            name: "LatestExam.de",
            url: "https://LatestExam.de",
            position: { x: 1850, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "8",
            name: "ushops.net",
            url: "https://ushops.net",
            position: { x: 2150, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "9",
            name: "seekphp.com",
            url: "https://seekphp.com",
            position: { x: 2450, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "10",
            name: "bpmplumbing.com",
            url: "https://bpmplumbing.com",
            position: { x: 2750, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "11",
            name: "serwisantdrukarek.pl",
            url: "https://serwisantdrukarek.pl",
            position: { x: 3050, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
          {
            id: "12",
            name: "dermatologholistyczny.pl",
            url: "https://dermatologholistyczny.pl",
            position: { x: 3350, y: 100 },
            tasks: DEFAULT_TASKS,
            createdAt: new Date().toISOString(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("domains", JSON.stringify(domains));
  }, [domains]);

  const addDomain = (domain: Omit<Domain, "id" | "createdAt" | "tasks">) => {
    const newDomain: Domain = {
      ...domain,
      id: Date.now().toString(),
      tasks: DEFAULT_TASKS,
      createdAt: new Date().toISOString(),
    };
    setDomains([...domains, newDomain]);
  };

  const updateDomain = (updatedDomain: Domain) => {
    setDomains(
      domains.map((domain) =>
        domain.id === updatedDomain.id ? updatedDomain : domain,
      ),
    );
  };

  const updateDomainPosition = (
    id: string,
    position: { x: number; y: number },
  ) => {
    setDomains(
      domains.map((domain) =>
        domain.id === id ? { ...domain, position } : domain,
      ),
    );
  };

  const updateTaskStatus = (
    domainId: string,
    taskId: string,
    completed: boolean,
  ) => {
    setDomains(
      domains.map((domain) => {
        if (domain.id === domainId) {
          return {
            ...domain,
            tasks: domain.tasks.map((task) =>
              task.id === taskId ? { ...task, completed } : task,
            ),
          };
        }
        return domain;
      }),
    );
  };

  const updateDomainTasks = (domainId: string, tasks: Task[]) => {
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
  };

  const removeDomainTask = (domainId: string, taskId: string) => {
    setDomains(
      domains.map((domain) => {
        if (domain.id === domainId) {
          return {
            ...domain,
            tasks: domain.tasks.filter((task) => task.id !== taskId),
          };
        }
        return domain;
      }),
    );
  };

  const removeDomain = (id: string) => {
    setDomains(domains.filter((domain) => domain.id !== id));
  };

  return (
    <DomainContext.Provider
      value={{
        domains,
        addDomain,
        updateDomain,
        updateDomainPosition,
        updateTaskStatus,
        updateDomainTasks,
        removeDomainTask,
        removeDomain,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};
