-- ============================================================
-- Navaja Barbershop · datos de ejemplo (Supabase / Postgres)
-- Copia de modules/*/data.json, ya traducida a las tablas de 01-esquema.sql.
-- Hace lo mismo que el script de la sección 3.4 de docs/IMPLEMENTAR.md,
-- pero sin necesitar la clave service_role: se corre pegado en el SQL Editor
-- o con el conector de Supabase.
--
-- Correlo UNA sola vez, sobre las tablas vacías y después de 01-esquema.sql.
-- Los turnos y los tickets quedan fechados HOY (hora de America/Argentina/Buenos_Aires).
-- ============================================================

do $$
begin
  if exists (select 1 from public.clientes) or exists (select 1 from public.turnos) then
    raise exception 'La base ya tiene datos. Este archivo es solo para una base recién creada.';
  end if;
end $$;

-- ---------- servicios ----------
insert into public.servicios (id, label, dur_min, precio, tinte) values
  ('corte', 'Corte clásico', 30, 450, 'corte'),
  ('fade', 'Fade', 30, 550, 'corte'),
  ('barba', 'Barba', 30, 350, 'barba'),
  ('perfilado', 'Perfilado', 30, 300, 'barba'),
  ('combo', 'Corte + barba', 60, 750, 'combo'),
  ('ritual', 'Ritual completo', 90, 1100, 'combo');

-- ---------- barberos ----------
insert into public.barberos (id, nombre, inicial, especialidad) values
  ('b1', 'Tobías Arrieta', 'TA', 'Fades y diseños'),
  ('b2', 'Ramiro Vega', 'RV', 'Barba y navaja'),
  ('b3', 'Nicolás Báez', 'NB', 'Corte clásico'),
  ('b4', 'Emiliano Sarli', 'ES', 'Ritual completo');

-- ---------- clientes ----------
-- ultima_visita viene como DD/MM: si ese día todavía no llegó este año, es del año pasado.
insert into public.clientes (id, nombre, telefono, email, barbero_fijo_id, servicio_habitual_id, fidelidad, ultima_visita, visitas, gasto)
select v.id, v.nombre, v.telefono, v.email, v.barbero_fijo_id, v.servicio_habitual_id, v.fidelidad,
       case when make_date(extract(year from h.hoy)::int, v.mm, v.dd) > h.hoy
            then make_date(extract(year from h.hoy)::int - 1, v.mm, v.dd)
            else make_date(extract(year from h.hoy)::int, v.mm, v.dd) end,
       v.visitas, v.gasto
from (values
  ('1', 'Iván Peralta', '+54 9 341 618 2047', 'ivan.peralta@gmail.com', 'b1', 'corte', 'vip', 8, 7, 14, 6300),
  ('2', 'Alejo Barrios', '+54 9 351 274 9938', 'abarrios@gmail.com', 'b3', 'combo', 'vip', 8, 7, 9, 6750),
  ('3', 'Lautaro Micheloud', '+54 9 342 903 1174', 'lauti.m@hotmail.com', 'b1', 'fade', 'vip', 8, 7, 22, 11550),
  ('4', 'Julián Escobar', '+54 9 261 445 7280', 'j.escobar@proton.me', 'b2', 'barba', 'habitual', 8, 7, 6, 2100),
  ('5', 'Tomás Aguirre', '+54 9 381 620 3391', 'tomasaguirre@outlook.com', 'b3', 'corte', 'habitual', 8, 7, 3, 1350),
  ('6', 'Cristian Maldonado', '+54 9 299 517 8842', 'cristian.m@hotmail.com', 'b4', 'ritual', 'vip', 8, 7, 11, 12100),
  ('7', 'Sergio Villalba', '+54 9 388 214 6675', 'svillalba@gmail.com', 'b2', 'perfilado', 'habitual', 8, 7, 8, 3200),
  ('8', 'Pablo Zárate', '+54 9 223 806 1159', 'pablo.zarate@yahoo.com', 'b4', 'combo', 'habitual', 8, 7, 5, 3750),
  ('9', 'Marco Aramburu', '+54 9 341 972 4408', 'm.aramburu@proton.me', 'b1', 'combo', 'vip', 8, 7, 17, 12750),
  ('10', 'Lucas Ibarra', '+54 9 351 338 5027', 'lucasibarra@outlook.com', 'b3', 'combo', 'nuevo', 8, 7, 2, 1500),
  ('11', 'Santiago Correa', '+54 9 381 246 7783', 'scorrea@outlook.com', 'b2', 'barba', 'vip', 8, 7, 12, 6400),
  ('12', 'Joaquín Medina', '+54 9 341 559 8804', 'joaquin.medina@hotmail.com', 'b4', 'combo', 'nuevo', 8, 7, 2, 1500),
  ('13', 'Franco Duarte', '+54 9 351 902 3346', 'fduarte@gmail.com', 'b3', 'fade', 'habitual', 8, 7, 8, 4400),
  ('14', 'Agustín Ferrari', '+54 9 342 118 6659', 'agus.ferrari@proton.me', 'b1', 'corte', 'vip', 8, 7, 15, 6750),
  ('15', 'Leandro Cardozo', '+54 9 388 640 2237', 'lcardozo@yahoo.com', 'b2', 'perfilado', 'habitual', 8, 7, 4, 1200),
  ('16', 'Emanuel Ríos', '+54 9 264 337 9915', 'emanuel.rios@gmail.com', 'b1', 'corte', 'nuevo', 8, 7, 1, 450),
  ('17', 'Gastón Rivero', '+54 9 264 719 6683', 'grivero@hotmail.com', 'b1', 'combo', 'habitual', 6, 7, 7, 5250),
  ('18', 'Rodrigo Cabral', '+54 9 387 502 3318', 'rodri.cabral@gmail.com', 'b3', 'corte', 'habitual', 5, 7, 4, 1800),
  ('19', 'Facundo Leiva', '+54 9 291 447 9902', 'fleiva@outlook.com', 'b2', 'ritual', 'vip', 5, 7, 13, 14300),
  ('20', 'Andrés Godoy', '+54 9 342 615 7734', 'andres.godoy@yahoo.com', 'b4', 'barba', 'nuevo', 5, 7, 1, 350),
  ('21', 'Ezequiel Sosa', '+54 9 358 209 4471', 'ezequiel.sosa@yahoo.com', 'b2', 'barba', 'vip', 4, 7, 10, 4200),
  ('22', 'Federico Núñez', '+54 9 341 880 2265', 'fnunez@proton.me', 'b3', 'corte', 'habitual', 4, 7, 6, 2700),
  ('23', 'Bruno Ferre', '+54 9 351 733 6690', 'brunoferre@gmail.com', 'b1', 'fade', 'habitual', 4, 7, 3, 1650),
  ('24', 'Hernán Ledesma', '+54 9 299 618 3327', 'h.ledesma@gmail.com', 'b4', 'ritual', 'vip', 3, 7, 9, 9900),
  ('25', 'Damián Roldán', '+54 9 261 904 5518', 'damian.roldan@hotmail.com', 'b2', 'combo', 'habitual', 3, 7, 5, 3750),
  ('26', 'Nahuel Ojeda', '+54 9 299 725 4408', 'nojeda@hotmail.com', 'b2', 'combo', 'habitual', 30, 6, 6, 4500),
  ('27', 'Darío Quinteros', '+54 9 351 480 6672', 'dario.q@gmail.com', 'b1', 'fade', 'habitual', 29, 6, 7, 3850),
  ('28', 'Matías Ferreyra', '+54 9 341 206 5583', 'matiasferreyra@outlook.com', 'b3', 'corte', 'vip', 28, 6, 20, 9000),
  ('29', 'Cristóbal Vera', '+54 9 387 913 2248', 'cristobal.vera@proton.me', 'b4', 'ritual', 'habitual', 27, 6, 3, 3300),
  ('30', 'Tobías Guzmán', '+54 9 261 508 7791', 'tguzman@hotmail.com', 'b3', 'corte', 'habitual', 26, 6, 5, 2250)
) as v(id, nombre, telefono, email, barbero_fijo_id, servicio_habitual_id, fidelidad, dd, mm, visitas, gasto)
cross join (select (now() at time zone 'America/Argentina/Buenos_Aires')::date as hoy) h;

-- ---------- turnos de HOY ----------
-- fecha toma su valor por defecto (hoy). fin = inicio + duración del servicio.
insert into public.turnos (id, barbero_id, servicio_id, cliente, inicio, fin, estado) values
  ('t01', 'b1', 'fade', 'Lautaro Micheloud', '09:00', '09:30', 'confirmado'),
  ('t02', 'b1', 'corte', 'Iván Peralta', '10:00', '10:30', 'confirmado'),
  ('t03', 'b1', 'combo', 'Gastón Rivero', '11:00', '12:00', 'confirmado'),
  ('t04', 'b1', 'fade', 'Darío Quinteros', '12:30', '13:00', 'no-vino'),
  ('t05', 'b1', 'combo', 'Marco Aramburu', '15:00', '16:00', 'confirmado'),
  ('t06', 'b1', 'fade', 'Bruno Ferre', '17:00', '17:30', 'pendiente'),
  ('t07', 'b2', 'barba', 'Julián Escobar', '09:30', '10:00', 'confirmado'),
  ('t08', 'b2', 'perfilado', 'Sergio Villalba', '10:30', '11:00', 'confirmado'),
  ('t09', 'b2', 'combo', 'Nahuel Ojeda', '11:30', '12:30', 'cancelado'),
  ('t10', 'b2', 'ritual', 'Facundo Leiva', '14:00', '15:30', 'confirmado'),
  ('t11', 'b2', 'barba', 'Ezequiel Sosa', '16:30', '17:00', 'pendiente'),
  ('t12', 'b2', 'combo', 'Damián Roldán', '18:00', '19:00', 'pendiente'),
  ('t13', 'b3', 'corte', 'Alejo Barrios', '09:00', '09:30', 'confirmado'),
  ('t14', 'b3', 'corte', 'Tomás Aguirre', '10:00', '10:30', 'confirmado'),
  ('t15', 'b3', 'corte', 'Rodrigo Cabral', '11:00', '11:30', 'pendiente'),
  ('t16', 'b3', 'corte', 'Matías Ferreyra', '13:00', '13:30', 'no-vino'),
  ('t17', 'b3', 'combo', 'Lucas Ibarra', '15:30', '16:30', 'confirmado'),
  ('t18', 'b3', 'corte', 'Federico Núñez', '17:30', '18:00', 'pendiente'),
  ('t19', 'b4', 'ritual', 'Cristian Maldonado', '10:00', '11:30', 'confirmado'),
  ('t20', 'b4', 'combo', 'Pablo Zárate', '12:00', '13:00', 'confirmado'),
  ('t21', 'b4', 'barba', 'Andrés Godoy', '14:30', '15:00', 'pendiente'),
  ('t22', 'b4', 'ritual', 'Hernán Ledesma', '16:00', '17:30', 'pendiente');

-- ---------- tickets de ventas (de HOY) ----------
insert into public.tickets (id, cliente, barbero_id, items, total, metodo, hora, estado) values
  ('c01', 'Iván Peralta', 'b1', array['Corte clásico']::text[], 450, 'Efectivo', '10:35', 'cobrado'),
  ('c02', 'Alejo Barrios', 'b3', array['Corte clásico', 'Cera fijadora']::text[], 750, 'Tarjeta', '09:40', 'cobrado'),
  ('c03', 'Lautaro Micheloud', 'b1', array['Fade']::text[], 550, 'QR', '09:35', 'cobrado'),
  ('c04', 'Julián Escobar', 'b2', array['Barba']::text[], 350, 'Efectivo', '10:05', 'cobrado'),
  ('c05', 'Tomás Aguirre', 'b3', array['Corte clásico']::text[], 450, 'Transferencia', '10:35', 'cobrado'),
  ('c06', 'Cristian Maldonado', 'b4', array['Ritual completo']::text[], 1100, 'Tarjeta', '11:30', 'cobrado'),
  ('c07', 'Sergio Villalba', 'b2', array['Perfilado', 'Aceite de barba']::text[], 750, 'QR', '11:05', 'cobrado'),
  ('c08', 'Pablo Zárate', 'b4', array['Corte + barba']::text[], 750, 'Efectivo', '13:00', 'cobrado'),
  ('c09', 'Marco Aramburu', 'b1', array['Corte + barba', 'Shampoo sólido']::text[], 1050, 'Tarjeta', '15:40', 'cobrado'),
  ('c10', 'Lucas Ibarra', 'b3', array['Corte + barba']::text[], 750, 'QR', '16:10', 'cobrado'),
  ('c11', 'Gastón Rivero', 'b1', array['Corte + barba']::text[], 750, 'Efectivo', '11:00', 'pendiente'),
  ('c12', 'Rodrigo Cabral', 'b3', array['Corte clásico']::text[], 450, 'Tarjeta', '11:00', 'pendiente'),
  ('c13', 'Facundo Leiva', 'b2', array['Ritual completo', 'Aceite de barba']::text[], 1550, 'QR', '14:00', 'pendiente'),
  ('c14', 'Andrés Godoy', 'b4', array['Barba']::text[], 350, 'Efectivo', '14:30', 'pendiente'),
  ('c15', 'Ezequiel Sosa', 'b2', array['Barba', 'Cera fijadora']::text[], 650, 'Transferencia', '16:30', 'pendiente'),
  ('c16', 'Federico Núñez', 'b3', array['Corte clásico']::text[], 450, 'QR', '17:30', 'pendiente'),
  ('c17', 'Bruno Ferre', 'b1', array['Fade']::text[], 550, 'Tarjeta', '17:00', 'pendiente'),
  ('c18', 'Hernán Ledesma', 'b4', array['Ritual completo']::text[], 1100, 'Efectivo', '16:00', 'pendiente'),
  ('c19', 'Damián Roldán', 'b2', array['Corte + barba']::text[], 750, 'QR', '18:00', 'pendiente'),
  ('c20', 'Emanuel Ríos', 'b1', array['Corte clásico']::text[], 450, 'Efectivo', '12:10', 'cobrado'),
  ('c21', 'Santiago Correa', 'b2', array['Barba', 'Aceite de barba']::text[], 800, 'Tarjeta', '12:40', 'rechazado'),
  ('c22', 'Joaquín Medina', 'b4', array['Corte + barba']::text[], 750, 'QR', '13:30', 'cobrado'),
  ('c23', 'Franco Duarte', 'b3', array['Fade', 'Cera fijadora']::text[], 850, 'Efectivo', '14:15', 'cobrado'),
  ('c24', 'Agustín Ferrari', 'b1', array['Corte clásico']::text[], 450, 'Transferencia', '15:00', 'cobrado'),
  ('c25', 'Leandro Cardozo', 'b2', array['Perfilado']::text[], 300, 'QR', '15:20', 'rechazado');

-- ---------- conversaciones ----------
insert into public.conversaciones (id, cliente, canal, sin_leer) values
  ('h1', 'Gastón Rivero', 'WhatsApp', 2),
  ('h2', 'Ezequiel Sosa', 'Instagram', 1),
  ('h3', 'Andrés Godoy', 'WhatsApp', 0),
  ('h4', 'Marco Aramburu', 'WhatsApp', 0),
  ('h5', 'Bruno Ferre', 'Instagram', 1),
  ('h6', 'Damián Roldán', 'WhatsApp', 0),
  ('h7', 'Federico Núñez', 'WhatsApp', 3),
  ('h8', 'Lucas Ibarra', 'Instagram', 0),
  ('h9', 'Sergio Villalba', 'WhatsApp', 0),
  ('h10', 'Cristian Maldonado', 'WhatsApp', 0),
  ('h11', 'Pablo Zárate', 'Instagram', 1),
  ('h12', 'Julián Escobar', 'WhatsApp', 0),
  ('h13', 'Nahuel Ojeda', 'WhatsApp', 0),
  ('h14', 'Agustín Ferrari', 'Instagram', 0);

-- ---------- mensajes ----------
-- En el JSON la hora puede ser "09:12" (hoy a esa hora) o un texto como "Ayer" (ayer a las 12:00).
insert into public.mensajes (conversacion_id, de, texto, enviado_at)
select v.conversacion_id, v.de, v.texto, ((h.hoy + v.dia) + v.hora) at time zone 'America/Argentina/Buenos_Aires'
from (values
  ('h1', 'cliente', '¡Hola! ¿Tienen lugar hoy a la mañana?', 0, time '09:02'),
  ('h1', 'local', '¡Buenas Gastón! Sí, 11:00 con Tobías. ¿Corte + barba?', 0, time '09:08'),
  ('h1', 'cliente', 'Perfecto, confirmo el combo a las 11', 0, time '09:12'),
  ('h2', 'cliente', 'Buenas, ¿cuánto sale la barba?', 0, time '08:40'),
  ('h2', 'local', '¡Hola Ezequiel! La barba $350, perfilado $300.', 0, time '08:44'),
  ('h2', 'cliente', '¿Se puede pagar con QR?', 0, time '08:47'),
  ('h3', 'cliente', 'Me recomendaron el lugar, ¿tienen turno hoy?', 0, time '08:10'),
  ('h3', 'local', '¡Bienvenido! 14:30 con Emiliano libre.', 0, time '08:15'),
  ('h3', 'cliente', '¡Primera vez que voy, gracias!', 0, time '08:20'),
  ('h4', 'local', 'Marco, se nos corrió la agenda. ¿Te paso a las 15?', -1, time '12:00'),
  ('h4', 'cliente', 'Dale, muevo el turno a las 15', -1, time '12:00'),
  ('h5', 'cliente', '¿Tienen cera fijadora en venta?', -1, time '12:00'),
  ('h6', 'local', 'Listo Damián, jueves 18:00 con Ramiro.', -1, time '12:00'),
  ('h6', 'cliente', 'Gracias, nos vemos el jueves', -1, time '12:00'),
  ('h7', 'cliente', 'Hola, ¿atienden niños?', -1, time '12:00'),
  ('h7', 'cliente', '¿Puedo llevar a mi hijo también?', -1, time '12:00'),
  ('h8', 'cliente', '¿Qué horario cierran los sábados?', -1, time '12:00'),
  ('h8', 'local', 'Sábados 09:00 a 18:00.', -1, time '12:00'),
  ('h9', 'cliente', 'El aceite de barba quedó bárbaro', -1, time '12:00'),
  ('h9', 'local', '¡Qué bueno Sergio! Cualquier cosa avisanos.', -1, time '12:00'),
  ('h10', 'cliente', 'Reservo el ritual para el finde', -1, time '12:00'),
  ('h10', 'local', 'Perfecto, sábado 10:00 con Emiliano.', -1, time '12:00'),
  ('h11', 'cliente', '¿Hacen diseño con máquina?', -1, time '12:00'),
  ('h12', 'local', 'Julián, tu turno es hoy 09:30.', -1, time '12:00'),
  ('h12', 'cliente', 'Perfecto, ahí confirmo', -1, time '12:00'),
  ('h13', 'cliente', 'Disculpen, no voy a poder llegar', -1, time '12:00'),
  ('h13', 'local', 'Sin problema Nahuel, reprogramamos.', -1, time '12:00'),
  ('h14', 'cliente', 'Buenísimo, gracias por la atención', -1, time '12:00')
) as v(conversacion_id, de, texto, dia, hora)
cross join (select (now() at time zone 'America/Argentina/Buenos_Aires')::date as hoy) h;

-- El inbox se ordena por el último mensaje de cada conversación.
update public.conversaciones c
   set ultimo_mensaje_at = (select max(m.enviado_at) from public.mensajes m where m.conversacion_id = c.id);

-- ---------- actividad del dashboard ----------
insert into public.actividad (ocurrio_at, texto, tipo)
select ((h.hoy + v.dia) + v.hora) at time zone 'America/Argentina/Buenos_Aires', v.texto, v.tipo
from (values
  ('Cobro $750 · Lucas Ibarra · QR', 'cobro', 0, time '16:10'),
  ('Cobro $1.050 · Marco Aramburu · tarjeta', 'cobro', 0, time '15:40'),
  ('Pago RECHAZADO · Leandro Cardozo · QR', 'rechazo', 0, time '15:20'),
  ('Cobro $450 · Agustín Ferrari · transferencia', 'cobro', 0, time '15:00'),
  ('Cobro $850 · Franco Duarte · efectivo', 'cobro', 0, time '14:15'),
  ('Cobro $750 · Joaquín Medina · QR', 'cobro', 0, time '13:30'),
  ('Pago RECHAZADO · Santiago Correa · tarjeta', 'rechazo', 0, time '12:40'),
  ('Darío Quinteros no vino al turno de las 12:30', 'rechazo', 0, time '12:30'),
  ('Nahuel Ojeda canceló su turno de las 11:30', 'rechazo', 0, time '11:30'),
  ('Nuevo mensaje de Gastón Rivero (WhatsApp)', 'mensaje', 0, time '09:12'),
  ('Nuevo mensaje de Ezequiel Sosa (Instagram)', 'mensaje', 0, time '08:47'),
  ('Andrés Godoy (cliente nuevo) reservó Barba', 'turno', 0, time '08:20')
) as v(texto, tipo, dia, hora)
cross join (select (now() at time zone 'America/Argentina/Buenos_Aires')::date as hoy) h;

-- ---------- config ----------
insert into public.ajustes (clave, valor) values
  ('local.direccion', '"Pasaje del Filo 458, Rosario"'::jsonb),
  ('local.telefono', '"+54 9 341 672 0198"'::jsonb),
  ('local.instagram', '"@navaja.barbershop"'::jsonb),
  ('local.dias', '"Lunes a sábado"'::jsonb);

insert into public.notificaciones (clave, label, activo) values
  ('recordatorio_turno', 'Recordatorio de turno por WhatsApp', true),
  ('silla_libre', 'Aviso de silla libre para clientes sin turno', true),
  ('encuesta', 'Encuesta post-servicio', false),
  ('cumpleanos', 'Promoción de cumpleaños del cliente', true);

-- ---------- vínculo cliente_id ----------
-- Los turnos, tickets y conversaciones del ejemplo traen el nombre del cliente, no su id.
-- Se enlazan por nombre para que el worker pueda encontrar el teléfono (sección 4 de la guía).
update public.turnos t         set cliente_id = c.id from public.clientes c where c.nombre = t.cliente and t.cliente_id is null;
update public.tickets t        set cliente_id = c.id from public.clientes c where c.nombre = t.cliente and t.cliente_id is null;
update public.conversaciones t set cliente_id = c.id from public.clientes c where c.nombre = t.cliente and t.cliente_id is null;
