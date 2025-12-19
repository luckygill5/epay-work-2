export async function loader({ request }) {
  const { handleAppProxy } = await import("../server/apps-epay.server");
  return handleAppProxy(request);
}

export default function AppProxy() {
  return null;
}
