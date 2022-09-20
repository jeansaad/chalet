interface IEvent {
  data: string;
}

export interface UpdateMonitor {
  env: Record<string, any>;
}

export function fetchServers() {
  return window.fetch("/_/servers").then((response) => response.json());
}

export function watchServers(cb: (data: any) => void) {
  if (window.EventSource) {
    new window.EventSource("/_/events").onmessage = (event: IEvent) => {
      const data = JSON.parse(event.data);
      cb(data);
    };
  } else {
    setInterval(() => {
      window
        .fetch("/_/servers")
        .then((response) => response.json())
        .then((data) => cb(data));
    }, 1000);
  }
}

export function watchOutput(cb: (data: any) => void) {
  if (window.EventSource) {
    new window.EventSource("/_/events/output").onmessage = (event: IEvent) => {
      const data = JSON.parse(event.data);
      cb(data);
    };
  } else {
    window.alert("Sorry, server logs aren't supported on this browser :(");
  }
}

export async function startMonitor(id: string) {
  return window.fetch(`/_/servers/${id}/start`, { method: "POST" });
}

export async function stopMonitor(id: string) {
  return window.fetch(`/_/servers/${id}/stop`, { method: "POST" });
}

export async function updateMonitor(id: string, updates: UpdateMonitor) {
  return window.fetch(`/_/servers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}
