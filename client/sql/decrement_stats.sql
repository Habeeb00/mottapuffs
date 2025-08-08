-- Create function to atomically decrement global stats by type (for purchases)
create or replace function public.decrement_stats(puff_type text, qty int)
returns void as $$
begin
  if puff_type = 'chicken' then
    update public.stats set chicken = greatest(chicken - qty, 0) where id = 1;
  elsif puff_type = 'motta' then
    update public.stats set motta = greatest(motta - qty, 0) where id = 1;
  elsif puff_type = 'meat' then
    update public.stats set meat = greatest(meat - qty, 0) where id = 1;
  end if;
end;
$$ language plpgsql security definer;

grant execute on function public.decrement_stats(text, int) to anon, authenticated; 
