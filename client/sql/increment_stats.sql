-- Create function to atomically decrement global stats by type (when puffs are consumed)
create or replace function public.increment_stats(puff_type text, qty int)
returns void as $$
begin
  if puff_type = 'chicken' then
    update public.stats set chicken = greatest(0, chicken - qty) where id = 1;
  elsif puff_type = 'motta' then
    update public.stats set motta = greatest(0, motta - qty) where id = 1;
  elsif puff_type = 'meat' then
    update public.stats set meat = greatest(0, meat - qty) where id = 1;
  end if;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_stats(text, int) to anon, authenticated; 