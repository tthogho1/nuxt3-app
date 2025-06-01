import type { RuntimeConfig } from 'nuxt/schema';

export const translateText = async function (
  jpString: string,
  config: RuntimeConfig
): Promise<string> {
  const url = `${config.public.translateApi}?text=${jpString}&source=ja&target=en`;

  const res = await fetch(url);
  const data = await res.json();

  return data.text;
};
