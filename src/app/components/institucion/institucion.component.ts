import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Pais } from 'src/app/models/pais';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from '../../models/municipio';
import { InstitucionService } from 'src/app/services/institucion.service';
import { CaracterAcademico } from 'src/app/models/caracter-academico';
import { NaturalezaJuridica } from 'src/app/models/naturaleza-juridica';
import { Sector } from 'src/app/models/sector';
import { Institucion } from 'src/app/models/institucion';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { InstitucionPdfService } from '../../services/institucion-pdf.service';
import { Norma } from 'src/app/models/norma';
import { Observable, map, startWith } from 'rxjs';
/* import { NormaService } from 'src/app/services/norma.service'; */

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css'],
})
export class InstitucionComponent {
  listadoInstitucion: Institucion[] = [];

  dataSource = new MatTableDataSource<Institucion>([]);
  displayedColumns: string[] = [
    'index',
    'nit',
    'ies',
    'iespadre',
    'nombre',
    'ccp',
    'naturaleza',
    'sector',
    'caracter',
    'estado',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoInstitucion();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioInstitucion, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioInstitucion, {
      width: '70%',
      disableClose: true,
      data: { institucion: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoInstitucion();
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalVistaInstitucion, {
      width: '70%',
      data: { institucion: element },
    });
  }

  obtenerListadoInstitucion() {
    this.institucionService.obtenerListadoInstitucion().subscribe((data) => {
      this.listadoInstitucion = data;
      this.dataSource = new MatTableDataSource<Institucion>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  editarInstitucion(element: Institucion) {
    this.editarFormulario(element);
  }
}

//// MODAL FORMULARIO

@Component({
  selector: 'modal-formulario-institucion',
  templateUrl: 'modal-formulario-institucion.html',
  styleUrls: ['./institucion.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioInstitucion {
  editar: boolean = false;
  nameFile: string = 'Archivo: pdf';
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCaracterAcademico: CaracterAcademico[] = [];
  listadoNaturalezaJuridica: NaturalezaJuridica[] = [];
  listadoSector: Sector[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];
  listadoInstitucion: Institucion[] = [];

  formInstitucion!: FormGroup;

  listadoNorma: Norma[] = [];
  filteredOptions!: Observable<Norma[]>;
  myControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioInstitucion>,
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    /* public normaService: NormaService, */
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPaises();
      this.obtenerPaisLocal();
      this.obtenerListadoCaracterAcademico();
      this.obtenerListadoNaturalezaJuridica();
      this.obtenerListadoSector();
      this.obtenerListadoNormas();
      this.crearFormInstitucion();
      if (JSON.stringify(data) !== 'null') {
        this.editarInstitucion(data.institucion);
      }
    }
  }

  obtenerListadoNormas() {
    /* this.normaService.obtenerNormasNoDerogadas().subscribe((data) => {
      this.listadoNorma = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    }); */
  }

  private _filter(value: string): Norma[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    return this.listadoNorma.filter((option) =>
      option.nombreCompleto.toLowerCase().includes(filterValue)
    );
  }

  asignarNormaHijo(codigo: number, fecha: Date) {
    this.formInstitucion.get('norma')!.setValue(codigo);
    this.formInstitucion.get('fechaNorma')!.setValue(fecha);
  }

  private crearFormInstitucion(): void {
    this.formInstitucion = this.formBuilder.group({
      codigo: new FormControl(''),
      nit: new FormControl('', Validators.required),
      ies: new FormControl('', Validators.required),
      iesPadre: new FormControl('', Validators.required),
      naturaleza: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      caracter: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      pais: new FormControl('', Validators.required),
      departamento: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      ccp: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      norma: new FormControl('', Validators.required),
      fechaNorma: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generarInstitucion(): void {
    let institucion: Institucion = new Institucion();
    institucion.nit = this.formInstitucion.get('nit')!.value;
    institucion.ies = this.formInstitucion.get('ies')!.value;
    institucion.iesPadre = this.formInstitucion.get('iesPadre')!.value;
    let naturalezaJuridica: NaturalezaJuridica = new NaturalezaJuridica();
    naturalezaJuridica.codigo = this.formInstitucion.get('naturaleza')!.value;
    institucion.naturaleza = naturalezaJuridica;
    let sector: Sector = new Sector();
    sector.codigo = this.formInstitucion.get('sector')!.value;
    institucion.sector = sector;
    let caracterAcademico: CaracterAcademico = new CaracterAcademico();
    caracterAcademico.codigo = this.formInstitucion.get('caracter')!.value;
    institucion.caracter = caracterAcademico;
    institucion.nombre = this.formInstitucion.get('nombre')!.value;
    let ccp: CabecerasCentrosPoblados = new CabecerasCentrosPoblados();
    ccp.divipola = this.formInstitucion.get('ccp')!.value;
    institucion.ccp = ccp;
    institucion.direccion = this.formInstitucion.get('direccion')!.value;
    institucion.telefono = this.formInstitucion.get('telefono')!.value;
    institucion.url = this.formInstitucion.get('url')!.value;
    institucion.norma = this.formInstitucion.get('norma')!.value;
    institucion.fechaNorma = this.formInstitucion.get('fechaNorma')!.value;
    this.registrarInstitucio(institucion);
  }

  registrarInstitucio(institucion: Institucion) {
    this.institucionService.registrarInstitucion(institucion).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.cancelar();
          this.crearFormInstitucion();
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarInstitucion(element: Institucion) {
    this.editar = true;
    this.formInstitucion.get('codigo')!.setValue(element.codigo);
    this.formInstitucion.get('nit')!.setValue(element.nit);
    this.formInstitucion.get('ies')!.setValue(element.ies);
    this.formInstitucion.get('iesPadre')!.setValue(element.iesPadre);
    this.formInstitucion.get('naturaleza')!.setValue(element.naturaleza.codigo);
    this.formInstitucion.get('sector')!.setValue(element.sector.codigo);
    this.formInstitucion.get('caracter')!.setValue(element.caracter.codigo);
    this.formInstitucion.get('nombre')!.setValue(element.nombre);
    this.formInstitucion.get('pais')!.setValue(element.pais.codigo);
    this.obtenerDepartamentosPorPais(element.pais.codigo);
    this.formInstitucion
      .get('departamento')!
      .setValue(element.departamento.divipola);
    this.obtenerMunicipiosPorDepartamento(element.departamento.divipola);
    this.formInstitucion.get('municipio')!.setValue(element.municipio.divipola);
    this.obtenerCcpPorMunicipio(element.municipio.divipola);
    this.formInstitucion.get('ccp')!.setValue(element.ccp.divipola);
    this.formInstitucion.get('direccion')!.setValue(element.direccion);
    this.formInstitucion.get('telefono')!.setValue(element.telefono);
    this.formInstitucion.get('url')!.setValue(element.url);
    this.formInstitucion.get('norma')!.setValue('' + element.norma);
    this.formInstitucion.get('fechaNorma')!.setValue(element.fechaNorma);
    this.formInstitucion.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formInstitucion.reset();
    this.crearFormInstitucion();
    this.editar = false;
  }

  obtenerListadoCaracterAcademico() {
    this.institucionService
      .obtenerListadoCaracterAcademico()
      .subscribe((data) => {
        this.listadoCaracterAcademico = data;
      });
  }

  obtenerListadoNaturalezaJuridica() {
    this.institucionService
      .obtenerListadoNaturalezaJuridica()
      .subscribe((data) => {
        this.listadoNaturalezaJuridica = data;
      });
  }

  obtenerListadoSector() {
    this.institucionService.obtenerListadoSector().subscribe((data) => {
      this.listadoSector = data;
    });
  }

  obtenerPaises() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.paises = data;
    });
  }

  obtenerPaisLocal() {
    this.ubicacionService.obtenerPaisLocal().subscribe((data) => {
      this.paisLocal = data;
    });
  }

  obtenerDepartamentosPorPais(codigo: number) {
    console.log('entra');
    this.municipios = [];
    if (codigo != null) {
      this.ubicacionService
        .obtenerDepartamentosPorPais(codigo)
        .subscribe((data) => {
          this.departamentos = data;
        });
    }
  }

  obtenerMunicipiosPorDepartamento(codigo: string) {
    this.listadoCcp = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.municipios = data;
      });
  }

  obtenerCcpPorMunicipio(codigo: string) {
    this.ubicacionService.obtenerCcpPorMunicipio(codigo).subscribe((data) => {
      this.listadoCcp = data;
    });
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso realizado',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}

//// MODAL REPORTE

@Component({
  selector: 'modal-institucion',
  templateUrl: 'modal-vista-institucion.html',
  styleUrls: ['./institucion.component.css'],
})
export class ModalVistaInstitucion implements OnInit {
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCaracterAcademico: CaracterAcademico[] = [];
  listadoNaturalezaJuridica: NaturalezaJuridica[] = [];
  listadoSector: Sector[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];

  @ViewChild('printSection', { static: false }) printSection!: ElementRef;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ModalVistaInstitucion>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public institucionPdfService: InstitucionPdfService
  ) {}

  ngOnInit() {}

  generarPdf() {
    this.institucionPdfService.export(this.data.institucion);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerListadoCaracterAcademico() {
    this.institucionService
      .obtenerListadoCaracterAcademico()
      .subscribe((data) => {
        this.listadoCaracterAcademico = data;
      });
  }

  obtenerListadoNaturalezaJuridica() {
    this.institucionService
      .obtenerListadoNaturalezaJuridica()
      .subscribe((data) => {
        this.listadoNaturalezaJuridica = data;
      });
  }

  obtenerListadoSector() {
    this.institucionService.obtenerListadoSector().subscribe((data) => {
      this.listadoSector = data;
    });
  }

  obtenerPaises() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.paises = data;
    });
  }

  obtenerPaisLocal() {
    this.ubicacionService.obtenerPaisLocal().subscribe((data) => {
      this.paisLocal = data;
    });
  }

  obtenerDepartamentosPorPais(codigo: number) {
    this.municipios = [];
    this.ubicacionService
      .obtenerDepartamentosPorPais(codigo)
      .subscribe((data) => {
        this.departamentos = data;
        console.log(this.departamentos);
      });
  }

  obtenerMunicipiosPorDepartamento(codigo: string) {
    this.listadoCcp = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.municipios = data;
      });
  }

  obtenerCcpPorMunicipio(codigo: string) {
    this.ubicacionService.obtenerCcpPorMunicipio(codigo).subscribe((data) => {
      this.listadoCcp = data;
    });
  }
}
