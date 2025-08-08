-- Create function to atomically increment global stats by type
create or replace function public.increment_stats(puff_type text, qty int)
returns void as $$
begin
  if puff_type = 'chicken' then
    update public.stats set chicken = chicken + qty where id = 1;
  elsif puff_type = 'motta' then
    update public.stats set motta = motta + qty where id = 1;
  elsif puff_type = 'meat' then
    update public.stats set meat = meat + qty where id = 1;
  end if;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_stats(text, int) to anon, authenticated; 