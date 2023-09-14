from django.db import models

# class Persona(models.Model):
#     ci = models.CharField(max_length=20, unique=True, verbose_name='CI')
#     nombres = models.CharField(max_length=255, verbose_name='Nombres')
#     apellidos = models.CharField(max_length=255, verbose_name='Apellidos')
#     telefono = models.CharField(max_length=20, verbose_name='Telefono')

#     def __str__(self):
#         return self.nombres

#     class Meta:
#         verbose_name = 'Persona'
#         verbose_name_plural = 'Personas'


# class Empleado(models.Model):
#     persona = models.OneToOneField(
#         Persona, related_name='empleado', on_delete=models.CASCADE)
#     usuario = models.OneToOneField(
#         User, related_name='empleado', on_delete=models.CASCADE)
#     correo = models.CharField(
#         max_length=255, unique=True, verbose_name='Correo')
#     cargo = models.CharField(max_length=200, verbose_name='Cargo')

#     def __str__(self):
#         return self.correo

#     class Meta:
#         verbose_name = 'Empleado'
#         verbose_name_plural = 'Empleados'


class Client(models.Model):
    nit = models.CharField(max_length=20, unique=True, verbose_name='Nit')
    first_name = models.CharField(max_length=255, verbose_name='Nombres')
    last_name = models.CharField(max_length=255, verbose_name='Apellidos')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha Creación')

    def __str__(self):
        return self.nit

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'